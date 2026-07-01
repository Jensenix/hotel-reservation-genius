/**
 * @module presenceManager
 * In-memory presence and editing-session tracker for Socket.IO.
 *
 * Responsibilities:
 * - Track online staff/admin socket connections
 * - Track which admin is editing which resource
 * - Support soft conflict warnings when multiple admins edit the same data
 * - Clean up editing sessions when a socket disconnects
 *
 * Notes:
 * - This is an in-memory manager.
 * - It works perfectly for one backend Node.js process.
 * - If the app is scaled to multiple backend instances later, this should move
 *   to Redis or PostgreSQL-backed presence storage.
 */

const staffConnections = new Map();
const activeEdits = new Map();

/**
 * Builds a stable key for editable resources.
 *
 * Examples:
 * - guest:1
 * - room:12
 * - booking:99
 *
 * @param {string} resourceType Resource type, e.g. guest, room, booking
 * @param {number|string} resourceId Resource ID
 *
 * @returns {string}
 */
function makeEditKey(resourceType, resourceId) {
  return `${resourceType}:${resourceId}`;
}

/**
 * Gets a display name from the authenticated socket user.
 *
 * @param {object} user Authenticated socket user
 *
 * @returns {string}
 */
function getUserDisplayName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.email ||
    `Admin ${user?.id || 'Unknown'}`
  );
}

/**
 * Tracks a staff/admin socket connection.
 *
 * Multiple sockets for the same user are allowed. This supports cases like:
 * - Same admin account opened in two browser tabs
 * - Same admin account opened on desktop and mobile
 *
 * @param {import('socket.io').Socket} socket Authenticated socket instance
 *
 * @returns {object|null} Online staff payload, or null if user is not staff/admin
 */
function addStaffConnection(socket) {
  const user = socket.data.user;

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return null;
  }

  const connection = {
    socketId: socket.id,
    userId: user.id,
    userName: getUserDisplayName(user),
    role: user.role,
    connectedAt: new Date().toISOString(),
  };

  staffConnections.set(socket.id, connection);

  return connection;
}

/**
 * Removes a staff/admin socket connection.
 *
 * @param {string} socketId Socket ID
 *
 * @returns {object|null} Removed staff connection, or null if not tracked
 */
function removeStaffConnection(socketId) {
  const connection = staffConnections.get(socketId);

  if (!connection) {
    return null;
  }

  staffConnections.delete(socketId);

  return connection;
}

/**
 * Checks whether a user still has another active socket connection.
 *
 * This prevents showing an admin as offline if they close one tab but still
 * have another tab connected.
 *
 * @param {number|string} userId User ID
 * @param {string} [exceptSocketId] Socket ID to ignore
 *
 * @returns {boolean}
 */
function hasOtherStaffConnections(userId, exceptSocketId) {
  for (const [socketId, connection] of staffConnections.entries()) {
    if (
      socketId !== exceptSocketId &&
      String(connection.userId) === String(userId)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns a deduplicated list of online staff/admin users.
 *
 * If one user has multiple tabs open, they appear once with multiple socket IDs.
 *
 * @returns {object[]}
 */
function getOnlineStaff() {
  const users = new Map();

  for (const connection of staffConnections.values()) {
    const key = String(connection.userId);

    if (!users.has(key)) {
      users.set(key, {
        userId: connection.userId,
        userName: connection.userName,
        role: connection.role,
        socketIds: [],
        connectedAt: connection.connectedAt,
      });
    }

    users.get(key).socketIds.push(connection.socketId);
  }

  return Array.from(users.values());
}

/**
 * Starts tracking that an admin/staff user is editing a resource.
 *
 * This is a soft-lock system:
 * - It does not block editing.
 * - It returns existing editors so the frontend can warn the user.
 *
 * @param {import('socket.io').Socket} socket Authenticated socket instance
 * @param {object} payload Editing payload
 * @param {string} payload.resourceType Resource type, e.g. guest, room
 * @param {number|string} payload.resourceId Resource ID
 * @param {string} [payload.resourceLabel] Human-readable resource label
 *
 * @returns {object}
 */
function startEditing(socket, payload = {}) {
  const { resourceType, resourceId, resourceLabel } = payload;
  const user = socket.data.user;

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return {
      ok: false,
      error: 'NOT_STAFF',
    };
  }

  if (!resourceType || resourceId === undefined || resourceId === null) {
    return {
      ok: false,
      error: 'INVALID_EDITING_PAYLOAD',
    };
  }

  const key = makeEditKey(resourceType, resourceId);
  const existingEditors = activeEdits.get(key) || [];

  const editor = {
    socketId: socket.id,
    userId: user.id,
    userName: getUserDisplayName(user),
    role: user.role,
    resourceType,
    resourceId,
    resourceLabel: resourceLabel || key,
    startedAt: new Date().toISOString(),
  };

  const filteredEditors = existingEditors.filter(
    (item) => item.socketId !== socket.id,
  );

  const nextEditors = [...filteredEditors, editor];

  activeEdits.set(key, nextEditors);

  const otherEditors = filteredEditors;

  return {
    ok: true,
    key,
    editor,
    editors: nextEditors,
    otherEditors,
    hasConflictWarning: otherEditors.length > 0,
  };
}

/**
 * Stops tracking that a socket is editing a resource.
 *
 * @param {import('socket.io').Socket} socket Authenticated socket instance
 * @param {object} payload Editing payload
 * @param {string} payload.resourceType Resource type
 * @param {number|string} payload.resourceId Resource ID
 *
 * @returns {object}
 */
function stopEditing(socket, payload = {}) {
  const { resourceType, resourceId } = payload;

  if (!resourceType || resourceId === undefined || resourceId === null) {
    return {
      ok: false,
      error: 'INVALID_EDITING_PAYLOAD',
    };
  }

  const key = makeEditKey(resourceType, resourceId);
  const existingEditors = activeEdits.get(key) || [];

  const removedEditors = existingEditors.filter(
    (item) => item.socketId === socket.id,
  );

  const nextEditors = existingEditors.filter(
    (item) => item.socketId !== socket.id,
  );

  if (nextEditors.length > 0) {
    activeEdits.set(key, nextEditors);
  } else {
    activeEdits.delete(key);
  }

  return {
    ok: true,
    key,
    removed: removedEditors.length > 0,
    removedEditors,
    editors: nextEditors,
  };
}

/**
 * Removes every editing session owned by a disconnected socket.
 *
 * @param {string} socketId Disconnected socket ID
 *
 * @returns {object[]} Removed edit-session summaries
 */
function removeSocketEdits(socketId) {
  const removed = [];

  for (const [key, editors] of activeEdits.entries()) {
    const removedEditors = editors.filter((editor) => editor.socketId === socketId);
    const nextEditors = editors.filter((editor) => editor.socketId !== socketId);

    if (removedEditors.length > 0) {
      if (nextEditors.length > 0) {
        activeEdits.set(key, nextEditors);
      } else {
        activeEdits.delete(key);
      }

      removed.push({
        key,
        removedEditors,
        editors: nextEditors,
      });
    }
  }

  return removed;
}

/**
 * Returns all active editing sessions.
 *
 * @returns {object[]}
 */
function getActiveEdits() {
  return Array.from(activeEdits.entries()).map(([key, editors]) => ({
    key,
    editors,
  }));
}

/**
 * Clears all tracked presence state.
 *
 * Useful during Socket.IO shutdown.
 *
 * @returns {void}
 */
function clearPresence() {
  staffConnections.clear();
  activeEdits.clear();
}

export {
  addStaffConnection,
  removeStaffConnection,
  hasOtherStaffConnections,
  getOnlineStaff,
  startEditing,
  stopEditing,
  removeSocketEdits,
  getActiveEdits,
  clearPresence,
};