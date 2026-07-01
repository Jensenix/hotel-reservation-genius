import db from '#models/index.js';

const { Booking } = db;

import BookingUtils from '#utils/bookingUtils.js';
import BookingEvents from '#utils/events/bookingEvents.js';
import bookingExtraServices from './bookingExtraService.service.js';

/**
 * @module BookingCreationService
 * Handles booking creation and creation-time side effects.
 *
 * Responsibilities:
 * - Validate required booking creation fields
 * - Resolve capped stay duration
 * - Find an available room
 * - Calculate room-only/base total price
 * - Apply selected extra services
 * - Publish booking-created realtime events
 */
class BookingCreationService {
  /**
   * Creates a booking.
   *
   * @param {Object} data Booking creation payload
   * @param {number|string} data.userId User ID
   * @param {number|string} data.roomTypeId Room type ID
   * @param {string} data.checkInDate Check-in date
   * @param {string} data.checkOutDate Check-out date
   * @param {number} [data.totalPrice] Optional frontend-provided total price
   * @param {string} [data.status] Optional booking status
   * @param {Array} [data.extraServices] Optional selected extra services
   *
   * @returns {Promise<Object>} Created booking
   */
  async createBooking({
    userId,
    roomTypeId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status,
    extraServices,
  } = {}) {
    if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
      const err = new Error(
        'userId, roomTypeId, checkInDate, and checkOutDate are required',
      );
      err.statusCode = 400;
      throw err;
    }

    const { checkOutDate: finalCheckOutDate, wasCapped } =
      BookingUtils.resolveStayDuration(checkInDate, checkOutDate);

    const finalTotalPrice = wasCapped ? null : totalPrice;

    const availableRoom = await BookingUtils.findAvailableRoom(
      roomTypeId,
      checkInDate,
      finalCheckOutDate,
    );

    if (!availableRoom) {
      const err = new Error(
        'All rooms of this type are fully booked for the selected dates',
      );
      err.statusCode = 400;
      throw err;
    }

    const calculatedPrice =
      finalTotalPrice ||
      (await BookingUtils.calculateTotalPrice(
        roomTypeId,
        checkInDate,
        finalCheckOutDate,
      ));

    const booking = await Booking.create({
      userId,
      roomId: availableRoom.id,
      checkInDate,
      checkOutDate: finalCheckOutDate,
      totalPrice: calculatedPrice,
      status: status || 'pending',
    });

    if (Array.isArray(extraServices) && extraServices.length > 0) {
      await bookingExtraServices.applyExtraServices(
        booking,
        extraServices,
        calculatedPrice,
      );

      await booking.reload();
    }

    await BookingEvents.bookingCreated(booking);

    return booking;
  }
}

export default new BookingCreationService();