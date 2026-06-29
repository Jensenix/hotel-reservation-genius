/**
 * eventPublisher.js
 *
 * PostgreSQL LISTEN/NOTIFY bridge for Socket.IO realtime events.
 */

import pg from 'pg';
import db from '#models/index.js';
import { broadcast } from './socketManager.js';

const { Client } = pg;
const { sequelize } = db;

// ---------------------------------------------------------------------------
// Channel registry
// ---------------------------------------------------------------------------

export const CHANNELS = {
  BOOKING: 'booking_events',
  PAYMENT: 'payment_events',
  ROOM: 'room_events',
};

const LISTEN_CHANNELS = Object.values(CHANNELS);

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

let listenClient = null;
let reconnectAttempts = 0;
let isShuttingDown = false;
let reconnectTimer = null;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

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
  } else if (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false') {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

function handleNotification(msg) {
  if (!msg.payload) return;

  try {
    const envelope = JSON.parse(msg.payload);
    
    // Extract routing instructions (not sent to clients)
    const { _routing, event } = envelope;

    if (!event || !_routing || !_routing.rooms || _routing.rooms.length === 0) {
      console.warn('[eventPublisher] Notification missing event or routing target — skipped');
      return;
    }

    // Clean the envelope for the client by removing backend routing data
    delete envelope._routing;

    console.log(`[eventPublisher] Routing '${event}' to ${JSON.stringify(_routing.rooms)}`);
    
    // Broadcast standard envelope to all target rooms simultaneously
    broadcast(_routing.rooms, event, envelope);
  } catch (err) {
    console.error('[eventPublisher] Failed to parse notification payload:', err.message);
  }
}

function scheduleReconnect() {
  if (isShuttingDown || reconnectTimer !== null) return;

  reconnectAttempts++;
  const delay = Math.min(
    RECONNECT_BASE_MS * 2 ** (reconnectAttempts - 1),
    RECONNECT_MAX_MS,
  );

  console.warn(`[eventPublisher] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})…`);

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

async function initializeEventListener() {
  if (listenClient) {
    listenClient.removeAllListeners();
    try { await listenClient.end(); } catch (_) {}
    listenClient = null;
  }

  const client = new Client(buildClientConfig());

  client.on('notification', handleNotification);
  client.on('error', (err) => console.error('[eventPublisher] LISTEN client error:', err.message));
  client.on('end', () => {
    listenClient = null;
    if (!isShuttingDown) {
      console.warn('[eventPublisher] LISTEN client connection closed. Reconnecting…');
      scheduleReconnect();
    }
  });

  await client.connect();

  for (const channel of LISTEN_CHANNELS) {
    await client.query(`LISTEN ${channel}`); 
  }

  listenClient = client;
  reconnectAttempts = 0;

  console.log(`[eventPublisher] Listening on: ${LISTEN_CHANNELS.join(', ')}`);
}

/**
 * Standardized Publish Method
 * @param {string} channel - The pg_notify channel
 * @param {Object} payload - The event config
 * @param {string} payload.event - From RealtimeEvents contract
 * @param {Object} payload.data - The actual mutated data (IDs and deltas only)
 * @param {Object} [payload.meta] - Optional metadata (actor, reason)
 * @param {string[]} [payload.rooms] - Array of target Socket.IO rooms
 * @param {string} [payload.room] - (Legacy) fallback for a single room string
 */
async function publish(channel, { event, data, meta, rooms, room }) {
  try {
    // Fallback for older single-room calls
    const targetRooms = rooms || (room ? [room] : []);

    // Create the Standard Envelope
    const envelope = {
      event,
      timestamp: new Date().toISOString(),
      data: data || {},
      meta: meta || {},
      _routing: { rooms: targetRooms } // Stripped before sending to frontend
    };

    const json = JSON.stringify(envelope);
    
    // Safety limit check (PostgreSQL pg_notify limit is ~8000 bytes)
    if (Buffer.byteLength(json, 'utf8') > 7500) {
      console.error(`[eventPublisher] Payload for ${event} exceeds safe size limit. Sent partial.`);
    }

    await sequelize.query('SELECT pg_notify(:channel, :payload)', {
      replacements: { channel, payload: json },
    });
  } catch (error) {
    console.error(`[eventPublisher] Failed to execute pg_notify for ${channel}:`, error);
  }
}

async function closeEventListener() {
  isShuttingDown = true;
  if (reconnectTimer !== null) clearTimeout(reconnectTimer);
  
  if (listenClient) {
    listenClient.removeAllListeners();
    try { await listenClient.end(); } catch (err) {}
    listenClient = null;
  }
}

export {
  publish,
  initializeEventListener as startListening,
  closeEventListener as stopListening,
};