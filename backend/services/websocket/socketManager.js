/**
 * @module socketManager
 * Socket.IO server lifecycle manager.
 *
 * Responsibilities:
 * - Initialize one Socket.IO server instance
 * - Authenticate socket connections using JWT middleware
 * - Track active socket connections
 * - Automatically join users into personal realtime rooms
 * - Automatically join admins/staff into the admin dashboard room
 * - Track staff online/offline presence
 * - Track admin/staff editing presence for soft conflict warnings
 * - Validate client-requested room joins
 * - Broadcast realtime events to one or more Socket.IO rooms
 * - Gracefully close the Socket.IO server during shutdown
 */

import { Server } from 'socket.io';
import socketAuth from '#middleware/socketAuth.js';
import { RealtimeEvents } from '../../shared/eventContract.js';

import {
  addStaffConnection,
  removeStaffConnection,
  hasOtherStaffConnections,
  getOnlineStaff,
  startEditing,
  stopEditing,
  removeSocketEdits,
  getActiveEdits,
  clearPresence,
} from './presenceManager.js';

/**
 * Singleton Socket.IO server instance.
 *
 * This stays null until initializeSocketIO() is called.
 */
let io = null;

/**
 * Tracks active socket connections.
 *
 * Key: socket.id
 * Value: {
 *   userId: number|string,
 *   role: string,
 *   joinedAt: Date
 * }
 */
const connections = new Map();

/**
 * How often Socket.IO sends ping packets to check client health.
 */
const PING_INTERVAL_MS = 25_000;

/**
 * How long Socket.IO waits for a pong response before disconnecting.
 */
const PING_TIMEOUT_MS = 20_000;

/**
 * Admin dashboard realtime room.
 */
const ADMIN_DASHBOARD_ROOM = 'admin:dashboard';

/**
 * Builds a standardized realtime envelope.
 *
 * Your frontend useWebSocket hook already understands this shape and unwraps
 * payload.data automatically.
 *
 * @param {string} event Event name
 * @param {object} [data={}] Event data
 * @param {object} [meta={}] Event metadata
 *
 * @returns {{ event: string, timestamp: string, data: object, meta: object }}
 */
function createEnvelope(event, data = {}, meta = {}) {
  return {
    event,
    timestamp: new Date().toISOString(),
    data,
    meta,
  };
}

/**
 * Emits a standardized event to the admin dashboard room.
 *
 * @param {string} eventName Event name
 * @param {object} [data={}] Event data
 * @param {object} [meta={}] Event metadata
 *
 * @returns {void}
 */
function emitToAdminDashboard(eventName, data = {}, meta = {}) {
  if (!io) return;

  io.to(ADMIN_DASHBOARD_ROOM).emit(
    eventName,
    createEnvelope(eventName, data, meta),
  );
}

/**
 * Emits the current online staff list to the admin dashboard.
 *
 * @returns {void}
 */
function emitStaffActiveList() {
  emitToAdminDashboard(RealtimeEvents.STAFF.ACTIVE_LIST, {
    staff: getOnlineStaff(),
  });
}

/**
 * Emits the current active editing-session list to the admin dashboard.
 *
 * @returns {void}
 */
function emitEditingActiveList() {
  emitToAdminDashboard(RealtimeEvents.EDITING.ACTIVE_LIST, {
    activeEdits: getActiveEdits(),
  });
}

/**
 * Initializes the Socket.IO server.
 *
 * This function is safe to call multiple times. If Socket.IO was already
 * initialized, it returns the existing instance instead of creating a new one.
 *
 * The server:
 * - Uses CORS origins from CORS_ORIGIN
 * - Falls back to localhost:5173 for local Vite development
 * - Applies JWT socket authentication
 * - Registers connection lifecycle handlers
 * - Registers editing presence handlers
 * - Registers staff presence handlers
 *
 * @param {import('http').Server} httpServer Express HTTP server instance
 *
 * @returns {Server} Socket.IO server instance
 */
function initializeSocketIO(httpServer) {
  if (io) return io;

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

  io.use(socketAuth);

  io.on('connection', (socket) => {
    onConnect(socket);

    socket.on('join_room', (room, callback) =>
      onJoinRoom(socket, room, callback),
    );

    socket.on('leave_room', (room) => onLeaveRoom(socket, room));

    socket.on('editing:start', (payload, callback) =>
      onEditingStart(socket, payload, callback),
    );

    socket.on('editing:stop', (payload, callback) =>
      onEditingStop(socket, payload, callback),
    );

    socket.on('editing:get_active', (callback) =>
      onEditingGetActive(callback),
    );

    socket.on('staff:get_active', (callback) =>
      onStaffGetActive(callback),
    );

    socket.on('disconnect', (reason) => onDisconnect(socket, reason));

    socket.on('error', (err) => {
      console.error(`[SocketManager] Socket error (${socket.id}):`, err.message);
    });
  });

  console.log(
    '[SocketManager] Initialized (CORS origins:',
    corsOrigins.join(', '),
    ')',
  );

  return io;
}

/**
 * Handles a newly authenticated socket connection.
 *
 * The authenticated user is expected to be attached by socketAuth:
 * socket.data.user = {
 *   id: number|string,
 *   role: string
 * }
 *
 * On connect:
 * - Saves connection metadata
 * - Joins the user to their personal room: user:{userId}
 * - Joins admins/staff to the admin dashboard room
 * - Tracks online staff/admin presence
 * - Broadcasts online status to admins when a staff user becomes online
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 */
function onConnect(socket) {
  const { id: userId, role } = socket.data.user;

  connections.set(socket.id, {
    userId,
    role,
    joinedAt: new Date(),
  });

  socket.join(`user:${userId}`);

  if (role === 'admin' || role === 'staff') {
    socket.join(ADMIN_DASHBOARD_ROOM);

    const wasAlreadyOnline = hasOtherStaffConnections(userId);
    const staffConnection = addStaffConnection(socket);

    if (staffConnection && !wasAlreadyOnline) {
      emitToAdminDashboard(RealtimeEvents.STAFF.ONLINE, {
        userId: staffConnection.userId,
        userName: staffConnection.userName,
        role: staffConnection.role,
        status: 'online',
      });
    }

    emitStaffActiveList();
    emitEditingActiveList();
  }

  console.log(
    `[SocketManager] + Connected  ${socket.id}  userId=${userId}  role=${role}`,
  );
}

/**
 * Handles a client request to join a Socket.IO room.
 *
 * The requested room must:
 * - Be a non-empty string
 * - Pass canJoinRoom() authorization rules
 *
 * The optional callback follows an acknowledgement style:
 * - { ok: true, room }
 * - { ok: false, error: string }
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {string} room Requested room name
 * @param {(response: object) => void} [callback] Optional Socket.IO acknowledgement callback
 */
function onJoinRoom(socket, room, callback) {
  if (typeof room !== 'string' || !room.trim()) {
    callback?.({ ok: false, error: 'INVALID_ROOM' });
    return;
  }

  if (!canJoinRoom(socket, room)) {
    console.warn(`[SocketManager] Room access denied: ${socket.id} -> ${room}`);
    callback?.({ ok: false, error: 'ROOM_ACCESS_DENIED' });
    return;
  }

  socket.join(room);

  callback?.({ ok: true, room });
}

/**
 * Handles a client request to leave a Socket.IO room.
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {string} room Room name to leave
 */
function onLeaveRoom(socket, room) {
  socket.leave(room);
}

/**
 * Handles a request to mark a resource as being edited.
 *
 * This is a soft-lock system:
 * - Editing is not blocked
 * - The frontend receives other active editors and can show a warning
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {object} payload Editing payload
 * @param {(response: object) => void} [callback] Socket acknowledgement callback
 *
 * @returns {void}
 */
function onEditingStart(socket, payload, callback) {
  const result = startEditing(socket, payload);

  if (!result.ok) {
    callback?.(result);
    return;
  }

  emitToAdminDashboard(RealtimeEvents.EDITING.STARTED, result);
  emitEditingActiveList();

  callback?.(result);
}

/**
 * Handles a request to stop marking a resource as being edited.
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {object} payload Editing payload
 * @param {(response: object) => void} [callback] Socket acknowledgement callback
 *
 * @returns {void}
 */
function onEditingStop(socket, payload, callback) {
  const result = stopEditing(socket, payload);

  if (!result.ok) {
    callback?.(result);
    return;
  }

  emitToAdminDashboard(RealtimeEvents.EDITING.STOPPED, result);
  emitEditingActiveList();

  callback?.(result);
}

/**
 * Returns the current active editing sessions to the requesting socket.
 *
 * @param {(response: object) => void} [callback] Socket acknowledgement callback
 *
 * @returns {void}
 */
function onEditingGetActive(callback) {
  callback?.({
    ok: true,
    activeEdits: getActiveEdits(),
  });
}

/**
 * Returns the current online staff list to the requesting socket.
 *
 * @param {(response: object) => void} [callback] Socket acknowledgement callback
 *
 * @returns {void}
 */
function onStaffGetActive(callback) {
  callback?.({
    ok: true,
    staff: getOnlineStaff(),
  });
}

/**
 * Handles socket disconnection.
 *
 * On disconnect:
 * - Removes the socket from the active connection map
 * - Removes staff presence for that socket
 * - Emits staff offline only if the user has no other connected sockets
 * - Removes editing sessions owned by that socket
 * - Broadcasts editing stop events for cleaned-up edit sessions
 *
 * @param {import('socket.io').Socket} socket Disconnected socket instance
 * @param {string} reason Socket.IO disconnect reason
 */
function onDisconnect(socket, reason) {
  const conn = connections.get(socket.id);

  if (conn) {
    console.log(
      `[SocketManager] - Disconnected ${socket.id}  userId=${conn.userId}  reason=${reason}`,
    );

    connections.delete(socket.id);
  }

  const removedEdits = removeSocketEdits(socket.id);

  for (const removedEdit of removedEdits) {
    emitToAdminDashboard(RealtimeEvents.EDITING.STOPPED, {
      ...removedEdit,
      reason: 'socket_disconnected',
    });
  }

  if (removedEdits.length > 0) {
    emitEditingActiveList();
  }

  const removedStaffConnection = removeStaffConnection(socket.id);

  if (removedStaffConnection) {
    const stillOnline = hasOtherStaffConnections(
      removedStaffConnection.userId,
    );

    if (!stillOnline) {
      emitToAdminDashboard(RealtimeEvents.STAFF.OFFLINE, {
        userId: removedStaffConnection.userId,
        userName: removedStaffConnection.userName,
        role: removedStaffConnection.role,
        status: 'offline',
        reason,
      });
    }

    emitStaffActiveList();
  }
}

/**
 * Checks whether a socket is allowed to join a specific room.
 *
 * Room rules:
 * - admin:dashboard can only be joined by admins/staff
 * - user:{id} can be joined by the matching user or by admins/staff
 * - room:{id} can be joined by any authenticated user
 * - all other room patterns are denied
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {string} room Requested room name
 *
 * @returns {boolean} True if the socket can join the room
 */
function canJoinRoom(socket, room) {
  const { id: userId, role } = socket.data.user;

  const isStaff = role === 'admin' || role === 'staff';

  if (room === ADMIN_DASHBOARD_ROOM) return isStaff;

  if (room.startsWith('user:')) {
    return String(userId) === room.split(':')[1] || isStaff;
  }

  if (room.startsWith('room:')) return true;

  return false;
}

/**
 * Broadcasts a realtime event envelope to one or more Socket.IO rooms.
 *
 * Socket.IO v3/v4 supports passing an array of room names to io.to().
 * The event is emitted once to every socket that belongs to at least one
 * of the target rooms.
 *
 * @param {string[]} targetRooms Array of Socket.IO rooms
 * @param {string} eventName Event name sent to the frontend
 * @param {object} standardEnvelope Standardized realtime payload
 *
 * @returns {void}
 */
function broadcast(targetRooms, eventName, standardEnvelope) {
  if (!io) {
    console.warn(
      '[SocketManager] broadcast() called before initialization — event dropped',
    );
    return;
  }

  console.log(
    `[SocketManager] Broadcasting '${eventName}' -> ${targetRooms.length} room(s)`,
  );

  io.to(targetRooms).emit(eventName, standardEnvelope);
}

/**
 * Gracefully closes the Socket.IO server.
 *
 * This should be called during server shutdown so active connections are closed
 * and in-memory connection/presence tracking is cleared.
 *
 * @returns {Promise<void>}
 */
async function closeIO() {
  if (!io) return;

  await io.close();

  io = null;
  connections.clear();
  clearPresence();

  console.log('[SocketManager] Closed');
}

/**
 * Returns the current Socket.IO server instance.
 *
 * @returns {Server|null} Active Socket.IO server instance, or null if not initialized
 */
function getIO() {
  return io;
}

/**
 * Returns the number of currently tracked socket connections.
 *
 * @returns {number} Active socket connection count
 */
function getConnectionCount() {
  return connections.size;
}

export {
  initializeSocketIO,
  broadcast,
  closeIO,
  getIO,
  getConnectionCount,
};