/**
 * @module socketEvents
 * Shared Socket.IO emit helpers.
 *
 * Responsibilities:
 * - Emit standardized realtime envelopes
 * - Keep common admin dashboard emissions reusable
 * - Avoid duplicating envelope/room logic inside socketManager
 */

import { RealtimeEvents } from '#shared/eventContract.js';
import { ADMIN_DASHBOARD_ROOM } from '#utils/sockets/socketRooms.js';
import { createEnvelope } from '#utils/sockets/socketEnvelope.js';

/**
 * Emits a standardized realtime envelope to the admin dashboard room.
 *
 * @param {import('socket.io').Server|null} io Socket.IO server instance
 * @param {string} eventName Event name
 * @param {object} [data={}] Event data
 * @param {object} [meta={}] Event metadata
 *
 * @returns {void}
 */
function emitToAdminDashboard(io, eventName, data = {}, meta = {}) {
  if (!io) return;

  io.to(ADMIN_DASHBOARD_ROOM).emit(
    eventName,
    createEnvelope(eventName, data, meta),
  );
}

/**
 * Emits the current online staff list to the admin dashboard.
 *
 * @param {import('socket.io').Server|null} io Socket.IO server instance
 * @param {object[]} staff Online staff list
 *
 * @returns {void}
 */
function emitStaffActiveList(io, staff) {
  emitToAdminDashboard(io, RealtimeEvents.STAFF.ACTIVE_LIST, {
    staff,
  });
}

/**
 * Emits the current active editing-session list to the admin dashboard.
 *
 * @param {import('socket.io').Server|null} io Socket.IO server instance
 * @param {object[]} activeEdits Active editing sessions
 *
 * @returns {void}
 */
function emitEditingActiveList(io, activeEdits) {
  emitToAdminDashboard(io, RealtimeEvents.EDITING.ACTIVE_LIST, {
    activeEdits,
  });
}

export {
  emitToAdminDashboard,
  emitStaffActiveList,
  emitEditingActiveList,
};