/**
 * @module socketConnectionStore
 * In-memory Socket.IO connection tracker.
 *
 * Responsibilities:
 * - Track active socket connections
 * - Store basic user/role metadata per socket
 * - Provide connection count for diagnostics
 */

const connections = new Map();

/**
 * Adds a socket connection to the active connection store.
 *
 * @param {import('socket.io').Socket} socket Connected socket instance
 *
 * @returns {{ userId: number|string, role: string, joinedAt: Date }}
 */
function addConnection(socket) {
  const { id: userId, role } = socket.data.user;

  const connection = {
    userId,
    role,
    joinedAt: new Date(),
  };

  connections.set(socket.id, connection);

  return connection;
}

/**
 * Removes a socket connection from the active connection store.
 *
 * @param {string} socketId Socket.IO socket ID
 *
 * @returns {{ userId: number|string, role: string, joinedAt: Date }|null}
 */
function removeConnection(socketId) {
  const connection = connections.get(socketId) || null;

  if (connection) {
    connections.delete(socketId);
  }

  return connection;
}

/**
 * Clears all tracked socket connections.
 *
 * @returns {void}
 */
function clearConnections() {
  connections.clear();
}

/**
 * Returns the number of currently tracked socket connections.
 *
 * @returns {number}
 */
function getConnectionCount() {
  return connections.size;
}

export {
  addConnection,
  removeConnection,
  clearConnections,
  getConnectionCount,
};