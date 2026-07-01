/**
 * @module socketManager
 * Socket.IO server lifecycle manager.
 *
 * Responsibilities:
 * - Initialize one Socket.IO server instance
 * - Authenticate socket connections using JWT middleware
 * - Register socket lifecycle/event handlers
 * - Join users into personal realtime rooms
 * - Join admins/staff into the admin dashboard room
 * - Coordinate staff presence and editing presence
 * - Broadcast realtime events to one or more Socket.IO rooms
 * - Gracefully close the Socket.IO server during shutdown
 */

import { Server } from 'socket.io';

import socketAuth from '#middleware/socketAuth.js';
import { RealtimeEvents } from '#shared/eventContract.js';

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

import {
  addConnection,
  removeConnection,
  clearConnections,
  getConnectionCount as getTrackedConnectionCount,
} from '#utils/sockets/socketConnectionStore.js';

import {
  ADMIN_DASHBOARD_ROOM,
  isStaffRole,
  getUserRoom,
  canJoinRoom,
} from '#utils/sockets/socketRooms.js';

import {
  emitToAdminDashboard,
  emitStaffActiveList,
  emitEditingActiveList,
} from '#utils/sockets/socketEvents.js';

/**
 * Singleton Socket.IO server instance.
 *
 * This stays null until initializeSocketIO() is called.
 */
let io = null;

/**
 * How often Socket.IO sends ping packets to check client health.
 */
const PING_INTERVAL_MS = 25_000;

/**
 * How long Socket.IO waits for a pong response before disconnecting.
 */
const PING_TIMEOUT_MS = 20_000;

/**
 * Emits the current online staff list to the admin dashboard.
 *
 * @returns {void}
 */
function emitCurrentStaffActiveList() {
  emitStaffActiveList(io, getOnlineStaff());
}

/**
 * Emits the current active editing-session list to the admin dashboard.
 *
 * @returns {void}
 */
function emitCurrentEditingActiveList() {
  emitEditingActiveList(io, getActiveEdits());
}

/**
 * Initializes the Socket.IO server.
 *
 * This function is safe to call multiple times. If Socket.IO was already
 * initialized, it returns the existing instance instead of creating a new one.
 *
 * @param {import('http').Server} httpServer Express HTTP server instance
 *
 * @returns {Server} Socket.IO server instance
 */
function initializeSocketIO(httpServer) {
  if (io) {return io;}

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
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

    socket.on('editing:get_active', (callback) => onEditingGetActive(callback));

    socket.on('staff:get_active', (callback) => onStaffGetActive(callback));

    socket.on('disconnect', (reason) => onDisconnect(socket, reason));

    socket.on('error', (err) => {
      console.error(
        `[SocketManager] Socket error (${socket.id}):`,
        err.message,
      );
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
 * On connect:
 * - Tracks the active socket connection
 * - Joins the user to user:{userId}
 * - Joins admins/staff to admin:dashboard
 * - Tracks staff online presence
 * - Emits staff/editing active lists to admin dashboard
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 *
 * @returns {void}
 */
function onConnect(socket) {
  const { id: userId, role } = socket.data.user;

  addConnection(socket);
  socket.join(getUserRoom(userId));

  if (isStaffRole(role)) {
    socket.join(ADMIN_DASHBOARD_ROOM);

    const wasAlreadyOnline = hasOtherStaffConnections(userId);
    const staffConnection = addStaffConnection(socket);

    if (staffConnection && !wasAlreadyOnline) {
      emitToAdminDashboard(io, RealtimeEvents.STAFF.ONLINE, {
        userId: staffConnection.userId,
        userName: staffConnection.userName,
        role: staffConnection.role,
        status: 'online',
      });
    }

    emitCurrentStaffActiveList();
    emitCurrentEditingActiveList();
  }

  console.log(
    `[SocketManager] + Connected  ${socket.id}  userId=${userId}  role=${role}`,
  );
}

/**
 * Handles a client request to join a Socket.IO room.
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 * @param {string} room Requested room name
 * @param {(response: object) => void} [callback] Optional acknowledgement callback
 *
 * @returns {void}
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
 *
 * @returns {void}
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

  emitToAdminDashboard(io, RealtimeEvents.EDITING.STARTED, result);
  emitCurrentEditingActiveList();

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

  emitToAdminDashboard(io, RealtimeEvents.EDITING.STOPPED, result);
  emitCurrentEditingActiveList();

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
 * - Removes the socket from connection tracking
 * - Removes editing sessions owned by the socket
 * - Emits editing stop updates for cleaned-up edit sessions
 * - Removes staff presence for the socket
 * - Emits staff offline only when the user has no other connected sockets
 *
 * @param {import('socket.io').Socket} socket Disconnected socket instance
 * @param {string} reason Socket.IO disconnect reason
 *
 * @returns {void}
 */
function onDisconnect(socket, reason) {
  const conn = removeConnection(socket.id);

  if (conn) {
    console.log(
      `[SocketManager] - Disconnected ${socket.id}  userId=${conn.userId}  reason=${reason}`,
    );
  }

  const removedEdits = removeSocketEdits(socket.id);

  for (const removedEdit of removedEdits) {
    emitToAdminDashboard(io, RealtimeEvents.EDITING.STOPPED, {
      ...removedEdit,
      reason: 'socket_disconnected',
    });
  }

  if (removedEdits.length > 0) {
    emitCurrentEditingActiveList();
  }

  const removedStaffConnection = removeStaffConnection(socket.id);

  if (removedStaffConnection) {
    const stillOnline = hasOtherStaffConnections(removedStaffConnection.userId);

    if (!stillOnline) {
      emitToAdminDashboard(io, RealtimeEvents.STAFF.OFFLINE, {
        userId: removedStaffConnection.userId,
        userName: removedStaffConnection.userName,
        role: removedStaffConnection.role,
        status: 'offline',
        reason,
      });
    }

    emitCurrentStaffActiveList();
  }
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
  if (!io) {return;}

  await io.close();

  io = null;
  clearConnections();
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
  return getTrackedConnectionCount();
}

export { initializeSocketIO, broadcast, closeIO, getIO, getConnectionCount };
