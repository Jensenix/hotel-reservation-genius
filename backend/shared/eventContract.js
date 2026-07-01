/**
 * Shared realtime event names used by the backend Socket.IO server and frontend listeners.
 */
export const RealtimeEvents = {
  BOOKING: {
    CREATED: 'booking:created',
    STATUS_CHANGED: 'booking:status_changed',
  },

  ROOM: {
    AVAILABILITY_CHANGED: 'room:availability_changed',
    STATUS_CHANGED: 'room:status_changed',
  },

  PAYMENT: {
    UPDATED: 'payment:updated',
  },

  USER: {
    CREATED: 'user:created',
    UPDATED: 'user:updated',
    DELETED: 'user:deleted',
  },

  EDITING: {
    STARTED: 'editing:started',
    STOPPED: 'editing:stopped',
    ACTIVE_LIST: 'editing:active_list',
  },

  STAFF: {
    ONLINE: 'staff:online',
    OFFLINE: 'staff:offline',
    ACTIVE_LIST: 'staff:active_list',
  },

  AUDIT: {
    CREATED: 'audit:created',
  },
};
