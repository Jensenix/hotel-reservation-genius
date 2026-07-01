import db from '#models/index.js';

const { Booking, Room } = db;

import BookingUtils from '#utils/bookingUtils.js';
import BaseService from '../base/base.service.js';

import bookingCreation from './bookingCreation.service.js';
import bookingQuery from './bookingQuery.service.js';
import bookingAdminQuery from './bookingAdminQuery.service.js';
import bookingExtraServices from './bookingExtraService.service.js';
import bookingLifecycle from './bookingLifecycle.service.js';

/**
 * @module BookingService
 * Booking service facade.
 *
 * Responsibilities:
 * - Preserve the existing public booking service API used by controllers
 * - Delegate creation logic to BookingCreationService
 * - Delegate read/query logic to BookingQueryService
 * - Delegate admin list/search logic to BookingAdminQueryService
 * - Delegate extra-service logic to BookingExtraServicesService
 * - Delegate status lifecycle transitions to BookingLifecycleService
 * - Keep generic update/delete behavior from BaseService
 */
class BookingService extends BaseService {
  constructor() {
    super(Booking, 'Booking');
  }

  /**
   * Applies extra services to a booking and updates the total price.
   *
   * Kept as a compatibility wrapper for internal callers that may still use
   * BookingService._applyExtraServices().
   *
   * @param {Object} booking Booking Sequelize instance
   * @param {Array} extraServicesPayload Extra-service selection payload
   * @param {number} baseTotal Room-only/base booking total
   *
   * @returns {Promise<number>} New total price
   */
  async _applyExtraServices(booking, extraServicesPayload, baseTotal) {
    return bookingExtraServices.applyExtraServices(
      booking,
      extraServicesPayload,
      baseTotal,
    );
  }

  /**
   * Creates a booking.
   *
   * @param {Object} data Booking creation payload
   *
   * @returns {Promise<Object>} Created booking
   */
  createBooking(data) {
    return bookingCreation.createBooking(data);
  }

  /**
   * Retrieves all bookings with pagination and optional filters.
   *
   * @param {Object} query Query parameters
   *
   * @returns {Promise<Object>} Paginated booking result
   */
  getAllBookings(query) {
    return bookingQuery.getAllBookings(query);
  }

  /**
   * Retrieves a booking by ID.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object|null>} Booking detail
   */
  getBookingById(id) {
    return bookingQuery.getBookingById(id);
  }

  /**
   * Updates a booking.
   *
   * Handles:
   * - Stay-duration normalization
   * - Total-price recalculation when capped dates are applied
   * - Extra-service replacement/recalculation
   *
   * @param {number|string} id Booking ID
   * @param {Object} data Update payload
   *
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(id, data) {
    const { extraServices, ...rest } = data || {};

    if (rest.checkInDate && rest.checkOutDate) {
      const { checkOutDate: finalCheckOutDate, wasCapped } =
        BookingUtils.resolveStayDuration(rest.checkInDate, rest.checkOutDate);

      rest.checkOutDate = finalCheckOutDate;

      if (wasCapped) {
        const bookingToUpdate = await this.model.findByPk(id, {
          include: [
            {
              model: Room,
              as: 'room',
            },
          ],
        });

        if (bookingToUpdate && bookingToUpdate.room) {
          rest.totalPrice = await BookingUtils.calculateTotalPrice(
            bookingToUpdate.room.roomTypeId,
            rest.checkInDate,
            rest.checkOutDate,
          );
        }
      }
    }

    const updatedBooking = await this.update(id, rest);

    if (Array.isArray(extraServices)) {
      const hasItems = extraServices.some(
        (item) => item && item.extraServiceId && Number(item.quantity) > 0,
      );

      if (hasItems || data?.clearExtraServices === true) {
        const baseTotal =
          rest.totalPrice ??
          (await BookingUtils.calculateTotalPrice(
            updatedBooking.room?.roomTypeId,
            updatedBooking.checkInDate,
            updatedBooking.checkOutDate,
          ));

        await bookingExtraServices.applyExtraServices(
          updatedBooking,
          extraServices,
          baseTotal,
        );

        await updatedBooking.reload();
      }
    }

    return updatedBooking;
  }

  /**
   * Retrieves bookings for the admin dashboard.
   *
   * @param {Object} query Admin query filters
   *
   * @returns {Promise<Object>} Paginated admin booking result
   */
  getAllBookingsAdmin(query) {
    return bookingAdminQuery.getAllBookingsAdmin(query);
  }

  /**
   * Deletes a booking.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object|void>}
   */
  deleteBooking(id) {
    return this.delete(id);
  }

  /**
   * Retrieves bookings owned by a user.
   *
   * @param {number|string} userId User ID
   *
   * @returns {Promise<Array>} User bookings
   */
  getUserBookings(userId) {
    return bookingQuery.getUserBookings(userId);
  }

  /**
   * Checks whether a room is available.
   *
   * @param {number|string} roomId Room ID
   * @param {string} checkInDate Check-in date
   * @param {string} checkOutDate Check-out date
   *
   * @returns {Promise<boolean>}
   */
  checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    return bookingQuery.checkRoomAvailability(
      roomId,
      checkInDate,
      checkOutDate,
    );
  }

  /**
   * Retrieves available rooms for a date range.
   *
   * @param {string} checkInDate Check-in date
   * @param {string} checkOutDate Check-out date
   * @param {number|string} [roomTypeId] Optional room type ID
   *
   * @returns {Promise<Array>}
   */
  getAvailableRooms(checkInDate, checkOutDate, roomTypeId) {
    return bookingQuery.getAvailableRooms(
      checkInDate,
      checkOutDate,
      roomTypeId,
    );
  }

  /**
   * Confirms a booking.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object>}
   */
  confirmBooking(id) {
    return bookingLifecycle.confirmBooking(id);
  }

  /**
   * Checks in a guest by admin.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object>}
   */
  checkInGuest(id) {
    return bookingLifecycle.checkInGuest(id);
  }

  /**
   * Checks out a guest by admin.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object>}
   */
  checkOutGuest(id) {
    return bookingLifecycle.checkOutGuest(id);
  }

  /**
   * Cancels a booking by admin.
   *
   * @param {number|string} id Booking ID
   * @param {string} reason Cancel reason
   *
   * @returns {Promise<Object>}
   */
  cancelBookingByAdmin(id, reason) {
    return bookingLifecycle.cancelBookingByAdmin(id, reason);
  }

  /**
   * Cancels a booking by user.
   *
   * @param {number|string} id Booking ID
   * @param {string} reason Cancel reason
   * @param {number|string} userId User ID
   *
   * @returns {Promise<Object>}
   */
  cancelBookingByUser(id, reason, userId) {
    return bookingLifecycle.cancelBookingByUser(id, reason, userId);
  }

  /**
   * Performs self check-in.
   *
   * @param {number|string} bookingId Booking ID
   * @param {number|string} userId User ID
   *
   * @returns {Promise<Object>}
   */
  selfCheckIn(bookingId, userId) {
    return bookingLifecycle.selfCheckIn(bookingId, userId);
  }

  /**
   * Performs self check-out.
   *
   * @param {number|string} bookingId Booking ID
   * @param {number|string} userId User ID
   *
   * @returns {Promise<Object>}
   */
  selfCheckOut(bookingId, userId) {
    return bookingLifecycle.selfCheckOut(bookingId, userId);
  }

  /**
   * Processes automated checkouts.
   *
   * @returns {Promise<void>}
   */
  processAutomatedCheckouts() {
    return bookingLifecycle.processAutomatedCheckouts();
  }
}

export default new BookingService();
