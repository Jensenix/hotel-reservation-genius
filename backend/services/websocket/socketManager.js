/**
 * @module socketManager
 * Socket.IO server lifecycle manager.
 */

import { Server } from 'socket.io';
import socketAuth from '#middleware/socketAuth.js';

let io = null;
const connections = new Map();

const PING_INTERVAL_MS = 25_000;
const PING_TIMEOUT_MS = 20_000;

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

function onConnect(socket) {
  const { id: userId, role } = socket.data.user;

  connections.set(socket.id, { userId, role, joinedAt: new Date() });

  socket.join(`user:${userId}`);

  if (role === 'admin') {
    socket.join('admin:dashboard');
  }

  console.log(`[SocketManager] + Connected  ${socket.id}  userId=${userId}  role=${role}`);
}

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

function onLeaveRoom(socket, room) {
  socket.leave(room);
}

function onDisconnect(socket, reason) {
  const conn = connections.get(socket.id);
  if (conn) {
    console.log(`[SocketManager] - Disconnected ${socket.id}  userId=${conn.userId}  reason=${reason}`);
    connections.delete(socket.id);
  }
}

function canJoinRoom(socket, room) {
  const { id: userId, role } = socket.data.user;
  if (room === 'admin:dashboard') return role === 'admin';
  if (room.startsWith('user:')) return String(userId) === room.split(':')[1] || role === 'admin';
  if (room.startsWith('room:')) return true;
  return false;
}

/**
 * Broadcasts a realtime envelope to an array of target rooms natively.
 * * @param {string[]} targetRooms - Array of Socket.IO rooms (e.g. ['user:1', 'admin:dashboard'])
 * @param {string} eventName - The canonical event name from RealtimeEvents
 * @param {Object} standardEnvelope - The standardized payload payload
 */
function broadcast(targetRooms, eventName, standardEnvelope) {
  if (!io) {
    console.warn('[SocketManager] broadcast() called before initialization — event dropped');
    return;
  }
  
  console.log(`[SocketManager] Broadcasting '${eventName}' -> ${targetRooms.length} room(s)`);
  
  // io.to() natively accepts an array of strings in Socket.IO v3/v4
  io.to(targetRooms).emit(eventName, standardEnvelope);
}

async function closeIO() {
  if (!io) return;
  await io.close();
  io = null;
  connections.clear();
  console.log('[SocketManager] Closed');
}

function getIO() {
  return io;
}

function getConnectionCount() {
  return connections.size;
}

export { initializeSocketIO, broadcast, closeIO, getIO, getConnectionCount };