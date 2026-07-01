/**
 * @module eventPublisher
 * PostgreSQL LISTEN/NOTIFY based event publisher for realtime updates.
 *
 * Responsibilities:
 * - Publish booking/payment/room/user events through PostgreSQL NOTIFY
 * - Listen to PostgreSQL channels using a dedicated pg Client
 * - Forward received events to Socket.IO rooms through socketManager.broadcast
 * - Automatically reconnect the LISTEN client if the database connection closes
 * - Safely stop the listener during server shutdown
 */

import pg from 'pg';
import db from '#models/index.js';
import { broadcast } from './socketManager.js';

const { Client } = pg;
const { sequelize } = db;

/**
 * PostgreSQL notification channels used by the realtime system.
 *
 * These channels separate different event domains so that booking,
 * payment, room, and user updates can be published independently.
 */
export const CHANNELS = {
  BOOKING: 'booking_events',
  PAYMENT: 'payment_events',
  ROOM: 'room_events',
  USER: 'user_events',
};

/**
 * List of all channels that the listener should subscribe to.
 */
const LISTEN_CHANNELS = Object.values(CHANNELS);

/**
 * Reconnect delay configuration for the LISTEN client.
 *
 * The reconnect delay starts at RECONNECT_BASE_MS and grows exponentially
 * until it reaches RECONNECT_MAX_MS.
 */
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

/**
 * Active PostgreSQL client used only for LISTEN/NOTIFY subscriptions.
 */
let listenClient = null;

/**
 * Number of reconnect attempts since the last successful connection.
 */
let reconnectAttempts = 0;

/**
 * Prevents reconnect attempts when the server is intentionally shutting down.
 */
let isShuttingDown = false;

/**
 * Stores the active reconnect timer so multiple reconnect attempts
 * are not scheduled at the same time.
 */
let reconnectTimer = null;

/**
 * Builds the PostgreSQL client configuration from Sequelize config
 * and environment variables.
 *
 * Priority:
 * 1. Sequelize config
 * 2. Environment variables
 * 3. Safe local defaults
 *
 * SSL is enabled when:
 * - Sequelize dialectOptions.ssl exists
 * - Or the app is running in production and DB_SSL is not explicitly false
 *
 * @returns {object} PostgreSQL client configuration
 */
function buildClientConfig() {
  const sq = sequelize.config || {};

  const config = {
    host: sq.host || process.env.DB_HOST || 'localhost',
    port: Number(sq.port || process.env.DB_PORT) || 5432,
    database: sq.database || process.env.DB_NAME,
    user: sq.username || process.env.DB_USER,
    password: sq.password || process.env.DB_PASSWORD,
  };

  if (sq.dialectOptions && sq.dialectOptions.ssl) {
    config.ssl = sq.dialectOptions.ssl;
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.DB_SSL !== 'false'
  ) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

/**
 * Handles a PostgreSQL NOTIFY message.
 *
 * Expected payload format:
 * {
 *   event: string,
 *   timestamp: string,
 *   data: object,
 *   meta: object,
 *   _routing: {
 *     rooms: string[]
 *   }
 * }
 *
 * The _routing field is used internally to decide which Socket.IO rooms
 * should receive the event. It is removed before the payload is broadcasted
 * to the frontend.
 *
 * @param {object} msg PostgreSQL notification message
 * @param {string} msg.payload JSON payload sent through pg_notify
 * @returns {void}
 */
function handleNotification(msg) {
  if (!msg.payload) {
    return;
  }

  try {
    const envelope = JSON.parse(msg.payload);

    const { _routing, event } = envelope;

    if (!event || !_routing || !_routing.rooms || _routing.rooms.length === 0) {
      console.warn(
        '[eventPublisher] Notification missing event or routing target — skipped',
      );
      return;
    }

    delete envelope._routing;

    broadcast(_routing.rooms, event, envelope);
  } catch (error) {
    console.error(
      '[eventPublisher] Failed to parse notification payload:',
      error.message,
    );
  }
}

/**
 * Schedules a reconnect attempt for the PostgreSQL LISTEN client.
 *
 * Uses exponential backoff:
 * 1s, 2s, 4s, 8s, etc.
 *
 * The delay is capped at RECONNECT_MAX_MS.
 * Reconnects are skipped when the server is shutting down.
 *
 * @returns {void}
 */
function scheduleReconnect() {
  if (isShuttingDown || reconnectTimer !== null) {
    return;
  }

  reconnectAttempts++;

  const delay = Math.min(
    RECONNECT_BASE_MS * 2 ** (reconnectAttempts - 1),
    RECONNECT_MAX_MS,
  );

  console.warn(
    `[eventPublisher] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})…`,
  );

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;

    try {
      await initializeEventListener();
    } catch (error) {
      console.error('[eventPublisher] Reconnect failed:', error.message);
      scheduleReconnect();
    }
  }, delay);
}

/**
 * Initializes the PostgreSQL LISTEN client.
 *
 * This function:
 * - Closes the old listener if one already exists
 * - Creates a new dedicated pg Client
 * - Registers notification, error, and end handlers
 * - Connects to PostgreSQL
 * - Subscribes to all realtime channels
 *
 * When the connection closes unexpectedly, the listener automatically
 * schedules a reconnect unless the server is shutting down.
 *
 * @returns {Promise<void>}
 */
async function initializeEventListener() {
  if (listenClient) {
    listenClient.removeAllListeners();

    try {
      await listenClient.end();
    } catch (error) {
      console.error(
        '[eventPublisher] Failed to close existing LISTEN client:',
        error.message,
      );
    }

    listenClient = null;
  }

  const client = new Client(buildClientConfig());

  client.on('notification', handleNotification);

  client.on('error', (error) => {
    console.error('[eventPublisher] LISTEN client error:', error.message);
  });

  client.on('end', () => {
    listenClient = null;

    if (!isShuttingDown) {
      console.warn(
        '[eventPublisher] LISTEN client connection closed. Reconnecting…',
      );
      scheduleReconnect();
    }
  });

  await client.connect();

  for (const channel of LISTEN_CHANNELS) {
    // eslint-disable-next-line no-await-in-loop
    await client.query(`LISTEN ${channel}`); // await is intentional to ensure sequential subscription
  }

  listenClient = client;
  reconnectAttempts = 0;

  console.log(`[eventPublisher] Listening on: ${LISTEN_CHANNELS.join(', ')}`);
}

/**
 * Publishes a realtime event through PostgreSQL NOTIFY.
 *
 * The event is wrapped inside an envelope before publishing.
 * The _routing field is included so the listener knows which Socket.IO rooms
 * should receive the event.
 *
 * Example:
 * await publish(CHANNELS.BOOKING, {
 *   event: 'booking_created',
 *   data: { bookingId: 1 },
 *   meta: { actorId: 1 },
 *   rooms: ['admin', 'guest:1'],
 * });
 *
 * @param {string} channel PostgreSQL channel name
 * @param {object} payload Event payload
 * @param {string} payload.event Event name sent to the frontend
 * @param {object} [payload.data] Main event data
 * @param {object} [payload.meta] Extra metadata about the event
 * @param {string[]} payload.rooms Socket.IO rooms that should receive the event
 * @returns {Promise<void>}
 */
async function publish(channel, { event, data, meta, rooms }) {
  try {
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      console.warn(
        `[eventPublisher] Dropped event '${event}' — missing or invalid 'rooms' array.`,
      );
      return;
    }

    const envelope = {
      event,
      timestamp: new Date().toISOString(),
      data: data || {},
      meta: meta || {},
      _routing: { rooms },
    };

    const json = JSON.stringify(envelope);

    if (Buffer.byteLength(json, 'utf8') > 7500) {
      console.error(
        `[eventPublisher] Payload for ${event} exceeds safe size limit. Sent partial.`,
      );
    }

    await sequelize.query('SELECT pg_notify(:channel, :payload)', {
      replacements: { channel, payload: json },
    });
  } catch (error) {
    console.error(
      `[eventPublisher] Failed to execute pg_notify for ${channel}:`,
      error,
    );
  }
}

/**
 * Stops the PostgreSQL LISTEN client.
 *
 * This should be called during server shutdown so that:
 * - reconnect attempts are cancelled
 * - the active PostgreSQL listener is closed
 * - no new reconnect is scheduled after the connection ends
 *
 * @returns {Promise<void>}
 */
async function closeEventListener() {
  isShuttingDown = true;

  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (listenClient) {
    listenClient.removeAllListeners();

    try {
      await listenClient.end();
    } catch (error) {
      console.warn(
        '[eventPublisher] Failed to close LISTEN client during shutdown:',
        error.message,
      );
    }

    listenClient = null;
  }
}

export {
  publish,
  initializeEventListener as startListening,
  closeEventListener as stopListening,
};
