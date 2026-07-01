import db from '#models/index.js';

const { Booking, Room } = db;

import { Op } from 'sequelize';
import BookingEvents from '#utils/bookingEvents.js';

/**
 * BookingLifecycleService
 *
 * Handles booking status transitions and related side effects.
 *
 * Responsibilities:
 * - Confirm pending bookings
 * - Check-in guests
 * - Check-out guests
 * - Cancel bookings
 * - Handle self-service check-in/check-out
 * - Automatically process expired stays
 *
 * This service keeps lifecycle rules isolated from
 * the main BookingService.
 */
class BookingLifecycleService {
  /**
   * Load booking with required relations.
   *
   * Used by lifecycle operations that require:
   * - User information
   * - Room information
   * - Room type
   * - Payment data
   *
   * @param {number} id Booking ID
   * @returns {Object|null} Booking instance
   */
  async _loadWithRoom(id) {
    return Booking.findByPk(id, {
      include: [
        'user',

        {
          model: Room,
          as: 'room',
          include: ['roomType'],
        },

        'payment',
      ],
    });
  }

  /**
   * Confirm a pending booking.
   *
   * Allowed transition:
   * pending -> confirmed
   *
   * @param {number} id Booking ID
   */
  async confirmBooking(id) {
    const booking = await this._loadWithRoom(id);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.status !== 'pending') {
      const err = new Error('Booking cannot be confirmed');

      err.statusCode = 400;
      throw err;
    }

    const updatedBooking = await booking.update({
      status: 'confirmed',
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    return updatedBooking;
  }

  /**
   * Check-in guest by admin.
   *
   * Allowed transition:
   * confirmed -> checked_in
   *
   * Also updates room state:
   * available -> occupied
   *
   * @param {number} id Booking ID
   */
  async checkInGuest(id) {
    const booking = await this._loadWithRoom(id);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.status !== 'confirmed') {
      const err = new Error('Only confirmed bookings can be checked in');

      err.statusCode = 400;
      throw err;
    }

    if (booking.room) {
      await booking.room.update({
        status: 'occupied',
      });
    }

    const updatedBooking = await booking.update({
      status: 'checked_in',
      actualCheckIn: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    await BookingEvents.roomAvailabilityChanged(booking.room, 'occupied');

    return updatedBooking;
  }

  /**
   * Check-out guest by admin.
   *
   * Allowed transition:
   * checked_in -> checked_out
   *
   * Room becomes available again.
   *
   * @param {number} id Booking ID
   */
  async checkOutGuest(id) {
    const booking = await this._loadWithRoom(id);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.status !== 'checked_in') {
      const err = new Error('Only checked-in guests can be checked out');

      err.statusCode = 400;
      throw err;
    }

    if (booking.room) {
      await booking.room.update({
        status: 'available',
      });
    }

    const updatedBooking = await booking.update({
      status: 'checked_out',
      actualCheckOut: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    await BookingEvents.roomAvailabilityChanged(booking.room, 'available');

    return updatedBooking;
  }

  /**
   * Cancel booking by admin.
   *
   * Restrictions:
   * - Cannot cancel checked-in bookings
   *
   * @param {number} id Booking ID
   * @param {string} reason Cancellation reason
   */
  async cancelBookingByAdmin(id, reason) {
    const booking = await this._loadWithRoom(id);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.status === 'checked_in') {
      const err = new Error('Cannot cancel checked-in booking');

      err.statusCode = 400;
      throw err;
    }

    const wasOccupied = booking.room && booking.room.status === 'occupied';

    if (wasOccupied) {
      await booking.room.update({
        status: 'available',
      });
    }

    const updatedBooking = await booking.update({
      status: 'cancelled',

      cancelReason: reason || 'Cancelled by admin',

      cancelledAt: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    if (wasOccupied) {
      await BookingEvents.roomAvailabilityChanged(booking.room, 'available');
    }

    return updatedBooking;
  }

  /**
   * Cancel booking by user.
   *
   * Validates ownership before cancellation.
   *
   * @param {number} id Booking ID
   * @param {string} reason Cancellation reason
   * @param {number} userId Owner ID
   */
  async cancelBookingByUser(id, reason, userId) {
    const booking = await this._loadWithRoom(id);

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.userId !== userId) {
      const err = new Error('Unauthorized: You cannot cancel this booking');

      err.statusCode = 403;
      throw err;
    }

    if (booking.status === 'checked_in') {
      const err = new Error('Cannot cancel checked-in booking');

      err.statusCode = 400;
      throw err;
    }

    const wasOccupied = booking.room && booking.room.status === 'occupied';

    if (wasOccupied) {
      await booking.room.update({
        status: 'available',
      });
    }

    const updatedBooking = await booking.update({
      status: 'cancelled',

      cancelReason: reason || 'Cancelled by user',

      cancelledAt: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    if (wasOccupied) {
      await BookingEvents.roomAvailabilityChanged(booking.room, 'available');
    }

    return updatedBooking;
  }

  /**
   * Self check-in by customer.
   *
   * Rules:
   * - User must own booking
   * - Booking must be confirmed
   * - Cannot check-in before scheduled date
   *
   * @param {number} bookingId
   * @param {number} userId
   */
  async selfCheckIn(bookingId, userId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Room,
          as: 'room',
        },
      ],
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error(
        'Unauthorized: You do not have permission to modify this booking',
      );
    }

    if (booking.status !== 'confirmed') {
      throw new Error('Booking must be confirmed before check-in');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(booking.checkInDate);

    checkInDate.setHours(0, 0, 0, 0);

    if (today < checkInDate) {
      throw new Error('Cannot check in before your scheduled check-in date');
    }

    if (booking.room) {
      await booking.room.update({
        status: 'occupied',
      });
    }

    const updatedBooking = await booking.update({
      status: 'checked_in',
      actualCheckIn: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    await BookingEvents.roomAvailabilityChanged(booking.room, 'occupied');

    return updatedBooking;
  }

  /**
   * Self check-out by customer.
   *
   * Rules:
   * - User must own booking
   * - Booking must currently be checked-in
   * - Cannot checkout early
   */
  async selfCheckOut(bookingId, userId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Room,
          as: 'room',
        },
      ],
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized: You cannot check out this booking');
    }

    if (booking.status !== 'checked_in') {
      throw new Error('Booking must be currently checked in to check out');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(booking.checkOutDate);

    checkOutDate.setHours(0, 0, 0, 0);

    if (today < checkOutDate) {
      const err = new Error(
        'Cannot check out before your scheduled check-out date',
      );

      err.statusCode = 400;

      throw err;
    }

    if (booking.room) {
      await booking.room.update({
        status: 'available',
      });
    }

    const updatedBooking = await booking.update({
      status: 'checked_out',

      actualCheckOut: new Date(),
    });

    await BookingEvents.bookingStatusChanged(updatedBooking);

    await BookingEvents.roomAvailabilityChanged(booking.room, 'available');

    return updatedBooking;
  }

  /**
   * Automatically checkout expired bookings.
   *
   * Finds:
   * checked_in bookings
   * where checkout date already passed.
   */
  async processAutomatedCheckouts() {
    const expiredBookings = await Booking.findAll({
      where: {
        status: 'checked_in',

        checkOutDate: {
          [Op.lt]: new Date(),
        },
      },
    });

    for (const booking of expiredBookings) {
      await this.checkOutGuest(booking.id);

      console.log(`Auto-checkout performed for booking ${booking.id}`);
    }
  }
}

export default new BookingLifecycleService();
