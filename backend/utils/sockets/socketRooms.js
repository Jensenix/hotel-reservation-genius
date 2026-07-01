/**
 * @module socketRooms
 * Socket.IO room naming and authorization helpers.
 *
 * Responsibilities:
 * - Store shared room name constants
 * - Build common room names
 * - Validate whether a socket can join a requested room
 */

const ADMIN_DASHBOARD_ROOM = 'admin:dashboard';

/**
 * Checks whether a role belongs to internal hotel staff.
 *
 * @param {string} role User role
 *
 * @returns {boolean}
 */
function isStaffRole(role) {
  return role === 'admin' || role === 'staff';
}

/**
 * Builds a personal user room.
 *
 * @param {number|string} userId User ID
 *
 * @returns {string}
 */
function getUserRoom(userId) {
  return `user:${userId}`;
}

/**
 * Builds a physical room realtime room.
 *
 * @param {number|string} roomId Room ID
 *
 * @returns {string}
 */
function getRoomRoom(roomId) {
  return `room:${roomId}`;
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
 * @returns {boolean}
 */
function canJoinRoom(socket, room) {
  const { id: userId, role } = socket.data.user;
  const isStaff = isStaffRole(role);

  if (room === ADMIN_DASHBOARD_ROOM) {return isStaff;}

  if (room.startsWith('user:')) {
    return String(userId) === room.split(':')[1] || isStaff;
  }

  if (room.startsWith('room:')) {return true;}

  return false;
}

export {
  ADMIN_DASHBOARD_ROOM,
  isStaffRole,
  getUserRoom,
  getRoomRoom,
  canJoinRoom,
};