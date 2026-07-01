import db from '#models/index.js';

const {
  Booking,
  User,
  Room,
  Payment,
  Review,
  ExtraService,
  RoomType,
  PaymentMethod,
} = db;

import BookingUtils from '#utils/bookingUtils.js';
import bookingExtraServices from './bookingExtraService.service.js';

/**
 * @module BookingQueryService
 * Handles customer-facing and general booking read operations.
 *
 * Responsibilities:
 * - List bookings with pagination
 * - Load booking detail by ID
 * - Load bookings owned by a user
 * - Check room availability
 * - Load available rooms for a date range
 */
class BookingQueryService {
  /**
   * Retrieves all bookings with pagination and optional filters.
   *
   * @param {Object} query Query parameters
   * @param {number|string} [query.page=1] Current page
   * @param {number|string} [query.limit=10] Items per page
   * @param {string} [query.status] Booking status filter
   * @param {number|string} [query.userId] User ID filter
   * @param {number|string} [query.roomId] Room ID filter
   *
   * @returns {Promise<Object>} Paginated booking result
   */
  async getAllBookings({ page = 1, limit = 10, status, userId, roomId } = {}) {
    const where = {};

    if (status) {where.status = status;}
    if (userId) {where.userId = userId;}
    if (roomId) {where.roomId = roomId;}

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await Booking.findAndCountAll({
      where,
      offset,
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        },
        {
          model: Room,
          as: 'room',
          include: [
            {
              model: RoomType,
              as: 'roomType',
              attributes: ['id', 'name', 'basePrice', 'maxCapacity'],
            },
          ],
        },
      ],
    });

    return {
      rows,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(count / parsedLimit),
        totalItems: count,
        itemsPerPage: parsedLimit,
      },
    };
  }

  /**
   * Retrieves booking detail by ID.
   *
   * Adds selectedExtraServices for frontend edit forms.
   *
   * @param {number|string} id Booking ID
   *
   * @returns {Promise<Object|null>} Booking detail or null
   */
  async getBookingById(id) {
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Room,
          as: 'room',
          include: [
            {
              model: RoomType,
              as: 'roomType',
              attributes: ['id', 'name', 'basePrice', 'maxCapacity'],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
          include: [
            {
              model: PaymentMethod,
              as: 'paymentMethod',
            },
          ],
        },
        {
          model: Review,
          as: 'reviews',
        },
        {
          model: ExtraService,
          as: 'extraServices',
          through: {
            attributes: ['quantity', 'subtotal'],
          },
        },
      ],
    });

    if (!booking) {return booking;}

    const plainBooking = booking.toJSON();

    plainBooking.selectedExtraServices =
      await bookingExtraServices.getSelectedExtraServices(booking.id);

    return plainBooking;
  }

  /**
   * Retrieves bookings owned by a specific user.
   *
   * @param {number|string} userId User ID
   *
   * @returns {Promise<Array>} User bookings
   */
  async getUserBookings(userId) {
    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      throw err;
    }

    return Booking.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        },
        {
          model: Room,
          as: 'room',
          include: [
            {
              model: RoomType,
              as: 'roomType',
              attributes: ['id', 'name', 'basePrice', 'maxCapacity'],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
          attributes: [
            'id',
            'paymentMethodId',
            'amount',
            'paymentStatus',
            'transactionTime',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Checks whether a specific room is available for a date range.
   *
   * @param {number|string} roomId Room ID
   * @param {string} checkInDate Check-in date
   * @param {string} checkOutDate Check-out date
   *
   * @returns {Promise<boolean>}
   */
  async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    if (!roomId || !checkInDate || !checkOutDate) {
      const err = new Error(
        'roomId, checkInDate, and checkOutDate are required',
      );
      err.statusCode = 400;
      throw err;
    }

    return BookingUtils.checkRoomAvailability(
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
  async getAvailableRooms(checkInDate, checkOutDate, roomTypeId) {
    if (!checkInDate || !checkOutDate) {
      const err = new Error('checkInDate and checkOutDate are required');
      err.statusCode = 400;
      throw err;
    }

    return BookingUtils.getAvailableRooms(
      checkInDate,
      checkOutDate,
      roomTypeId,
    );
  }
}

export default new BookingQueryService();