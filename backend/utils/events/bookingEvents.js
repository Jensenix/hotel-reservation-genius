/**
 * @module BookingEvents
 * Centralized realtime event publisher for booking and room lifecycle events.
 *
 * Responsibilities:
 * - Publish booking creation events
 * - Publish booking status change events
 * - Publish room availability change events
 * - Keep realtime publishing logic out of booking service/controller files
 * - Ensure every lifecycle transition emits events in a consistent format
 */

import { publish, CHANNELS } from '#services/websocket/eventPublisher.js';
import { RealtimeEvents } from '#shared/eventContract.js';

/**
 * Handles realtime events related to bookings and room availability.
 *
 * This class keeps publish() calls in one place so booking lifecycle flows
 * do not need to repeatedly write the same try/catch and payload structure.
 */
class BookingEvents {
  /**
   * Publishes a booking status change event.
   *
   * This notifies:
   * - The guest who owns the booking
   * - The admin dashboard
   *
   * Typical use cases:
   * - Booking confirmed
   * - Booking checked in
   * - Booking checked out
   * - Booking cancelled
   *
   * @param {object} booking Booking instance or booking-like object
   * @param {number|string} booking.id Booking ID
   * @param {number|string} booking.userId Guest user ID
   * @param {string} booking.status New booking status
   *
   * @returns {Promise<void>}
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
   * Publishes a booking created event.
   *
   * This notifies:
   * - The guest who created the booking
   * - The admin dashboard
   *
   * @param {object} booking Booking instance or booking-like object
   * @param {number|string} booking.id Booking ID
   * @param {number|string} booking.userId Guest user ID
   * @param {number|string} booking.roomId Assigned room ID
   * @param {string} booking.status Initial booking status
   *
   * @returns {Promise<void>}
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
   * Publishes a physical room availability change event.
   *
   * This notifies:
   * - The room-specific realtime room
   * - The admin dashboard
   *
   * If no room is provided, the method exits quietly because there is no
   * room target to publish to.
   *
   * @param {object|null} room Room instance or room-like object
   * @param {number|string} room.id Room ID
   * @param {string} status New room availability status
   *
   * @returns {Promise<void>}
   */
  static async roomAvailabilityChanged(room, status) {
    if (!room) {return;}

    try {
      await publish(CHANNELS.ROOM, {
        event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
        data: {
          roomId: room.id,
          status,
        },
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
