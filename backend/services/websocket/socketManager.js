/**
 * @module socketManager
 * Socket.IO server lifecycle manager.
 *
 * Owns the singleton Socket.IO Server instance and handles:
 *   - Server initialization and CORS configuration
 *   - JWT authentication via socketAuth middleware
 *   - Socket connect / disconnect lifecycle
 *   - Automatic room assignment based on authenticated identity
 *   - Client-requested room joins with server-side access validation
 *   - Active connection tracking for observability
 *   - Broadcasting to named rooms on behalf of eventPublisher
 *
 * Room naming conventions:
 *   admin:dashboard  — all admin sockets; receives all booking/payment events
 *   user:{userId}    — personal channel for a specific user's events
 *   room:{roomId}    — room availability updates; any authenticated user may join
 *
 * Architecture note:
 * This module is the only place that holds a reference to the io Server.
 * Business services (Phase 2) never import socket.io directly — they call
 * eventPublisher.publish() which in turn calls broadcast() here. This
 * keeps realtime logic isolated from REST business logic.
 */

import { Server } from 'socket.io';
import socketAuth from '#middleware/socketAuth.js';

/** @type {import('socket.io').Server | null} */
let io = null;

/**
 * Tracks metadata for every active socket connection.
 * Used for observability and ensures disconnect cleanup is O(1).
 *
 * @type {Map<string, { userId: string|number, role: string, joinedAt: Date }>}
 */
const connections = new Map();

/**
 * Socket.IO heartbeat configuration.
 *
 * pingInterval: how often (ms) the server sends a ping to each client.
 * pingTimeout:  how long (ms) the server waits for a pong before
 *               treating the socket as dead and disconnecting it.
 *
 * Combined they detect a dead socket within ~45s, which is tighter than
 * Socket.IO's default 80s and appropriate for a hotel operations context
 * where stale admin sessions should be surfaced quickly.
 */
const PING_INTERVAL_MS = 25_000;
const PING_TIMEOUT_MS = 20_000;

/**
 * Initialises the Socket.IO server and attaches it to the HTTP server.
 *
 * Must be called once, before server.listen(), passing the same http.Server
 * instance that Express is mounted on. Calling this again after
 * initialization is a no-op (returns the existing io instance).
 *
 * @param {import('http').Server} httpServer - The raw Node.js HTTP server
 * @returns {import('socket.io').Server}
 */
function initializeSocketIO(httpServer) {
  if (io) {
    console.warn('[SocketManager] initializeSocketIO called more than once — ignored');
    return io;
  }

  /**
   * CORS origins are read from the environment so that the development
   * default (Vite dev server) never has to be changed for deployment.
   *
   * Example .env:
   *   CORS_ORIGIN=https://your-hotel-app.com,https://admin.your-hotel-app.com
   */
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:5173'];

  io = new Server(httpServer, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: PING_INTERVAL_MS,
    pingTimeout: PING_TIMEOUT_MS,
  });

  // Authenticate every socket before any events are processed.
  io.use(socketAuth);

  io.on('connection', (socket) => {
    onConnect(socket);

    socket.on('join_room', (room, callback) => onJoinRoom(socket, room, callback));
    socket.on('leave_room', (room) => onLeaveRoom(socket, room));
    socket.on('disconnect', (reason) => onDisconnect(socket, reason));
    socket.on('error', (err) => {
      console.error(`[SocketManager] Socket error (${socket.id}):`, err.message);
    });
  });

  console.log('[SocketManager] Initialized (CORS origins:', corsOrigins.join(', '), ')');
  return io;
}

/**
 * Handles a new authenticated connection.
 *
 * Auto-joins two channels so clients receive relevant events without
 * needing to send explicit join_room events:
 *   - user:{userId}      — personal notifications for every user
 *   - admin:dashboard    — dashboard events (admins only)
 *
 * Room subscriptions for browsing (room:{roomId}) are client-initiated
 * via the join_room event so the server only tracks rooms the client
 * is actively viewing.
 *
 * @param {import('socket.io').Socket} socket
 */
function onConnect(socket) {
  const { id: userId, role } = socket.data.user;

  connections.set(socket.id, { userId, role, joinedAt: new Date() });

  socket.join(`user:${userId}`);

  if (role === 'admin') {
    socket.join('admin:dashboard');
  }

  console.log(`[SocketManager] + Connected  ${socket.id}  userId=${userId}  role=${role}`);
}

/**
 * Handles a client-initiated room join request.
 *
 * The client may optionally pass an acknowledgement callback; the server
 * always calls it with a result object so clients can confirm membership
 * before starting to rely on live events for a given room.
 *
 * @param {import('socket.io').Socket} socket
 * @param {string} room
 * @param {((result: { ok: boolean, room?: string, error?: string }) => void) | undefined} callback
 */
function onJoinRoom(socket, room, callback) {
  if (typeof room !== 'string' || !room.trim()) {
    callback?.({ ok: false, error: 'INVALID_ROOM' });
    return;
  }

  if (!canJoinRoom(socket, room)) {
    console.warn(
      `[SocketManager] Room access denied: ${socket.id} (userId=${socket.data.user.id}) → ${room}`,
    );
    callback?.({ ok: false, error: 'ROOM_ACCESS_DENIED' });
    return;
  }

  socket.join(room);
  callback?.({ ok: true, room });
}

/**
 * Handles a client-initiated room leave request.
 *
 * @param {import('socket.io').Socket} socket
 * @param {string} room
 */
function onLeaveRoom(socket, room) {
  socket.leave(room);
}

/**
 * Handles socket disconnection and removes it from the connection map.
 *
 * Socket.IO automatically removes the socket from all rooms it joined,
 * so no manual room cleanup is needed here. Phase 3 (presenceManager)
 * will hook into this event for editing-lock release.
 *
 * @param {import('socket.io').Socket} socket
 * @param {string} reason - Socket.IO disconnect reason string
 */
function onDisconnect(socket, reason) {
  const conn = connections.get(socket.id);
  if (conn) {
    console.log(
      `[SocketManager] - Disconnected ${socket.id}  userId=${conn.userId}  reason=${reason}`,
    );
    connections.delete(socket.id);
  }
}

/**
 * Determines whether the socket's authenticated user is permitted to join
 * the requested room.
 *
 * Access matrix:
 *   admin:dashboard  → admin role only
 *   user:{id}        → the matching user, or any admin
 *   room:{id}        → any authenticated user (public room browsing)
 *   anything else    → denied
 *
 * @param {import('socket.io').Socket} socket
 * @param {string} room
 * @returns {boolean}
 */
function canJoinRoom(socket, room) {
  const { id: userId, role } = socket.data.user;

  if (room === 'admin:dashboard') {
    return role === 'admin';
  }

  if (room.startsWith('user:')) {
    const targetUserId = room.split(':')[1];
    return String(userId) === targetUserId || role === 'admin';
  }

  if (room.startsWith('room:')) {
    return true;
  }

  return false;
}

/**
 * Broadcasts a realtime event to all sockets currently in the given room.
 *
 * Called by eventPublisher when a PostgreSQL notification arrives.
 * Silently no-ops if the Socket.IO server has not been initialized yet,
 * which prevents errors during startup ordering edge cases.
 *
 * @param {string} room  - Target Socket.IO room (e.g. 'admin:dashboard')
 * @param {string} event - Event name the client listens for (e.g. 'booking_created')
 * @param {Object} data  - Serialisable event payload
 */
function broadcast(room, event, data) {
  if (!io) {
    console.warn('[SocketManager] broadcast() called before initialization — event dropped');
    return;
  }
  io.to(room).emit(event, data);
}

/**
 * Closes the Socket.IO server and clears all connection tracking.
 * Called during graceful shutdown from server.js.
 *
 * @returns {Promise<void>}
 */
async function closeIO() {
  if (!io) return;

  await io.close();
  io = null;
  connections.clear();

  console.log('[SocketManager] Closed');
}

/**
 * Returns the active Socket.IO Server instance, or null before initialization.
 * Useful in Phase 3 (presenceManager) for direct io access.
 *
 * @returns {import('socket.io').Server | null}
 */
function getIO() {
  return io;
}

/**
 * Returns the number of currently tracked socket connections.
 * Useful for load testing and health check endpoints.
 *
 * @returns {number}
 */
function getConnectionCount() {
  return connections.size;
}

export { initializeSocketIO, broadcast, closeIO, getIO, getConnectionCount };