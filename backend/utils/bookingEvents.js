import { publish, CHANNELS } from '../services/websocket/eventPublisher.js';
import { RealtimeEvents } from '../shared/eventContract.js';

/**
 * Centralizes the booking/room realtime events. Every lifecycle transition
 * (confirm, check-in, check-out, cancel, ...) was previously copy-pasting
 * the same publish()+try/catch+console.error block, which made it easy for
 * one call site to drift from the others (e.g. selfCheckIn originally
 * forgetting to publish at all). Keeping it in one place means every
 * transition emits events the same way.
 */
class BookingEvents {
  /**
   * Publishes a booking status change to the guest and the admin dashboard.
   */
  static async bookingStatusChanged(booking) {
    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: booking.id,
          status: booking.status,
        },
        rooms: [`user:${booking.userId}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingEvents] Failed to publish booking status changed:',
        err.message,
      );
    }
  }

  /**
   * Publishes that a new booking was created.
   */
  static async bookingCreated(booking) {
    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.CREATED,
        data: {
          bookingId: booking.id,
          userId: booking.userId,
          roomId: booking.roomId,
          status: booking.status,
        },
        rooms: [`user:${booking.userId}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingEvents] Failed to publish booking created:',
        err.message,
      );
    }
  }

  /**
   * Publishes a physical room's availability change (occupied/available).
   * No-ops quietly if there's no room to report on.
   */
  static async roomAvailabilityChanged(room, status) {
    if (!room) return;
    try {
      await publish(CHANNELS.ROOM, {
        event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
        data: { roomId: room.id, status },
        rooms: [`room:${room.id}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingEvents] Failed to publish room availability changed:',
        err.message,
      );
    }
  }
}

export default BookingEvents;