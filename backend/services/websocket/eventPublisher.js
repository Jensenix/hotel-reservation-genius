/**
 * eventPublisher.js
 *
 * PostgreSQL LISTEN/NOTIFY bridge for Socket.IO realtime events.
 *
 * Flow:
 *   Business service
 *     → publish(channel, payload)
 *     → PostgreSQL NOTIFY
 *     → dedicated LISTEN client (this file)
 *     → socketManager.broadcast()
 *     → Socket.IO clients
 *
 * LISTEN uses a raw pg.Client (never the Sequelize pool).
 * NOTIFY uses sequelize.query() so publish rides the existing pool.
 */

import pg from 'pg';
import db from '#models/index.js';
import { broadcast } from './socketManager.js';

const { Client } = pg;
const { sequelize } = db;

// ---------------------------------------------------------------------------
// Channel registry
// ---------------------------------------------------------------------------

/**
 * Canonical channel names shared between publishers and the listener.
 * Phase 2 services import CHANNELS to avoid raw string duplication.
 *
 * @example
 * import { publish, CHANNELS } from '../websocket/eventPublisher.js';
 * await publish(CHANNELS.BOOKING, { event: 'booking:updated', data: booking });
 */
export const CHANNELS = {
  BOOKING: 'booking_events',
  PAYMENT: 'payment_events',
  ROOM: 'room_events',
};

/** All channels the LISTEN client subscribes to. */
const LISTEN_CHANNELS = Object.values(CHANNELS);

// ---------------------------------------------------------------------------
// Reconnect configuration
// ---------------------------------------------------------------------------

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

// ---------------------------------------------------------------------------
// Module-level LISTEN client state
// ---------------------------------------------------------------------------

/** @type {pg.Client|null} */
let listenClient = null;

let reconnectAttempts = 0;
let isShuttingDown = false;

/** @type {ReturnType<typeof setTimeout>|null} */
let reconnectTimer = null;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Builds a pg.Client config from environment variables.
 * Supports DATABASE_URL (12-factor) or individual DB_* vars.
 *
 * @returns {import('pg').ClientConfig}
 */
function buildClientConfig() {
  /** @type {import('pg').ClientConfig} */
  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };

  // SSL is required by most hosted PostgreSQL services in production.
  // Set DB_SSL=false to opt out explicitly.
  if (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false') {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

/**
 * Routes an incoming pg NOTIFY message to Socket.IO via socketManager.
 *
 * Expected payload shape:
 * ```json
 * { "event": "booking:updated", "data": { ... }, "room": "user_42" }
 * ```
 * `room` is optional — omit to broadcast to all connected clients.
 *
 * Note: pg_notify has an 8 000-byte payload cap. Send IDs, not full objects,
 * when data may be large.
 *
 * @param {import('pg').Notification} msg
 */
function handleNotification(msg) {
  if (!msg.payload) {
    console.warn('[eventPublisher] Received empty notification payload — skipped');
    return;
  }

  try {
    const { event, data, room } = JSON.parse(msg.payload);

    if (!event) {
      console.warn('[eventPublisher] Notification missing "event" field — skipped');
      return;
    }

    if (!room) {
      console.warn(`[eventPublisher] No target room for event "${event}" — dropped`);
      return;
    }

    // socketManager.broadcast signature: (room, event, data)
    broadcast(room, event, data ?? {});
  } catch (err) {
    console.error('[eventPublisher] Failed to parse notification payload:', err.message);
  }
}

/**
 * Schedules a reconnect attempt with exponential backoff.
 * No-ops when shutdown is in progress or a reconnect is already pending.
 */
function scheduleReconnect() {
  if (isShuttingDown || reconnectTimer !== null) return;

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
    } catch (err) {
      console.error('[eventPublisher] Reconnect failed:', err.message);
      scheduleReconnect();
    }
  }, delay);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initializes the dedicated pg.Client for PostgreSQL LISTEN.
 *
 * Safe to call on startup and after connection loss (tears down any stale
 * client before creating a fresh one). Resets the reconnect counter on
 * successful connection.
 *
 * @returns {Promise<void>}
 */
async function initializeEventListener() {
  // Tear down any stale client from a previous (failed) session.
  if (listenClient) {
    listenClient.removeAllListeners();
    try { await listenClient.end(); } catch (_) { /* already gone */ }
    listenClient = null;
  }

  const client = new Client(buildClientConfig());

  // Wire up event handlers before connecting so nothing is missed.

  client.on('notification', handleNotification);

  client.on('error', (err) => {
    // pg emits 'error' on broken connections, followed by 'end'.
    // We log here; reconnect is scheduled in 'end' to avoid double-scheduling.
    console.error('[eventPublisher] LISTEN client error:', err.message);
  });

  client.on('end', () => {
    listenClient = null;
    if (!isShuttingDown) {
      console.warn('[eventPublisher] LISTEN client connection closed. Reconnecting…');
      scheduleReconnect();
    }
  });

  await client.connect();

  for (const channel of LISTEN_CHANNELS) {
    await client.query(`LISTEN "${channel}"`);
  }

  listenClient = client;
  reconnectAttempts = 0; // reset backoff counter on clean connect

  console.log(`[eventPublisher] Listening on: ${LISTEN_CHANNELS.join(', ')}`);
}

/**
 * Publishes an event to a PostgreSQL channel via NOTIFY.
 *
 * Uses `sequelize.query()` so the publish path shares the existing
 * authenticated connection pool and respects Sequelize's credential config.
 *
 * Any LISTEN client subscribed to `channel` — including the one in this
 * module — will receive the notification.
 *
 * @param {string} channel - Target channel (use CHANNELS constants).
 * @param {{ event: string, data?: object, room?: string }} payload
 * @returns {Promise<void>}
 *
 * @example
 * await publish(CHANNELS.BOOKING, {
 *   event: 'booking:confirmed',
 *   data: { bookingId: 99 },
 *   room: 'user_42',
 * });
 */
async function publish(channel, payload) {
  const json = JSON.stringify(payload);
  await sequelize.query('SELECT pg_notify(:channel, :payload)', {
    replacements: { channel, payload: json },
  });
}

/**
 * Gracefully shuts down the LISTEN client.
 *
 * Cancels any pending reconnect timer so the process can exit cleanly.
 * Should be called in the server's shutdown handler (SIGTERM / SIGINT).
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
      console.log('[eventPublisher] LISTEN client closed.');
    } catch (err) {
      console.error('[eventPublisher] Error closing LISTEN client:', err.message);
    } finally {
      listenClient = null;
    }
  }
}

export {
  publish,
  initializeEventListener as startListening,
  closeEventListener as stopListening,
};