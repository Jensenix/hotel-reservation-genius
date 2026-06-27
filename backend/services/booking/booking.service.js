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
import { Op } from 'sequelize';
import BookingUtils from '#utils/bookingUtils.js';
import BaseService from '../base/base.service.js';

class BookingService extends BaseService {
  constructor() {
    super(Booking, 'Booking');
  }

  /**
   * Creates a new booking with business logic for finding available rooms and calculating price.
   * @param {Object} data - The booking data.
   * @param {string|number} data.userId - The ID of the user making the booking.
   * @param {string|number} data.roomTypeId - The requested room type ID.
   * @param {string} data.checkInDate - The check-in date.
   * @param {string} data.checkOutDate - The check-out date.
   * @param {number} [data.totalPrice] - The total price (calculated automatically if not provided).
   * @param {string} [data.status] - The booking status (defaults to 'pending').
   * @returns {Promise<Object>} The created booking.
   * @throws {Error} If required fields are missing or no rooms are available.
   */
  async createBooking({
    userId,
    roomTypeId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status,
  }) {
    if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
      const err = new Error(
        'userId, roomTypeId, checkInDate, and checkOutDate are required',
      );
      err.statusCode = 400;
      throw err;
    }

    const availableRoom = await BookingUtils.findAvailableRoom(
      roomTypeId,
      checkInDate,
      checkOutDate,
    );
    if (!availableRoom) {
      const err = new Error(
        'All rooms of this type are fully booked for the selected dates',
      );
      err.statusCode = 400;
      throw err;
    }

    let calculatedPrice =
      totalPrice ||
      (await BookingUtils.calculateTotalPrice(
        roomTypeId,
        checkInDate,
        checkOutDate,
      ));

    return super.create({
      userId,
      roomId: availableRoom.id,
      checkInDate,
      checkOutDate,
      totalPrice: calculatedPrice,
      status: status || 'pending',
    });
  }

  /**
   * Retrieves all bookings with pagination and filtering.
   * @param {Object} query - The query parameters.
   * @param {number} [query.page=1] - The page number.
   * @param {number} [query.limit=10] - The number of records per page.
   * @param {string} [query.status] - Filter by booking status.
   * @param {string|number} [query.userId] - Filter by user ID.
   * @param {string|number} [query.roomId] - Filter by room ID.
   * @returns {Promise<Object>} An object containing the rows and pagination details.
   */
  async getAllBookings({ page = 1, limit = 10, status, userId, roomId }) {
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (roomId) where.roomId = roomId;

    const parsedLimit = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * parsedLimit;

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
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(count / parsedLimit),
        totalItems: count,
        itemsPerPage: parsedLimit,
      },
    };
  }

  /**
   * Retrieves a specific booking by ID, including all deep relationships.
   * @param {string|number} id - The ID of the booking to retrieve.
   * @returns {Promise<Object>} The booking data with nested associations.
   * @throws {Error} If the booking is not found.
   */
  async getBookingById(id) {
    return super.getById(id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
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
          include: [{ model: PaymentMethod, as: 'paymentMethod' }],
        },
        { model: Review, as: 'reviews' },
        {
          model: ExtraService,
          as: 'extraServices',
          through: { attributes: ['quantity', 'subtotal'] },
        },
      ],
    });
  }

  /**
   * Confirms a pending booking.
   * @param {string|number} id - The ID of the booking to confirm.
   * @returns {Promise<Object>} The updated booking data.
   * @throws {Error} If the booking is not found or not in 'pending' status.
   */
  async confirmBooking(id) {
    const booking = await super.getById(id, {
      include: [
        'user',
        { model: Room, as: 'room', include: ['roomType'] },
        'payment',
      ],
    });

    if (booking.status !== 'pending') {
      const err = new Error('Booking cannot be confirmed');
      err.statusCode = 400;
      throw err;
    }

    return booking.update({ status: 'confirmed' });
  }

  /**
   * Checks in a guest and marks the room as occupied.
   * @param {string|number} id - The ID of the booking.
   * @returns {Promise<Object>} The updated booking data.
   * @throws {Error} If the booking is not found or not in 'confirmed' status.
   */
  async checkInGuest(id) {
    const booking = await super.getById(id, {
      include: [
        'user',
        { model: Room, as: 'room', include: ['roomType'] },
        'payment',
      ],
    });

    if (booking.status !== 'confirmed') {
      const err = new Error('Only confirmed bookings can be checked in');
      err.statusCode = 400;
      throw err;
    }

    await booking.room.update({ status: 'occupied' });
    return booking.update({ status: 'checked_in', actualCheckIn: new Date() });
  }

  /**
   * Checks out a guest and marks the room as available.
   * @param {string|number} id - The ID of the booking.
   * @returns {Promise<Object>} The updated booking data.
   * @throws {Error} If the booking is not found or not in 'checked_in' status.
   */
  async checkOutGuest(id) {
    const booking = await super.getById(id, {
      include: [
        'user',
        { model: Room, as: 'room', include: ['roomType'] },
        'payment',
      ],
    });

    if (booking.status !== 'checked_in') {
      const err = new Error('Only checked-in guests can be checked out');
      err.statusCode = 400;
      throw err;
    }

    await booking.room.update({ status: 'available' });
    return booking.update({
      status: 'checked_out',
      actualCheckOut: new Date(),
    });
  }

  /**
   * Cancels a booking, freeing up the room if it was occupied.
   * @param {string|number} id - The ID of the booking to cancel.
   * @param {string} [reason] - The reason for cancellation.
   * @returns {Promise<Object>} The cancelled booking data.
   * @throws {Error} If the booking is not found or is currently checked-in.
   */
  async cancelBooking(id, reason) {
    const booking = await super.getById(id, {
      include: [
        'user',
        { model: Room, as: 'room', include: ['roomType'] },
        'payment',
      ],
    });

    if (booking.status === 'checked_in') {
      const err = new Error('Cannot cancel checked-in booking');
      err.statusCode = 400;
      throw err;
    }

    if (booking.room.status === 'occupied') {
      await booking.room.update({ status: 'available' });
    }

    return booking.update({
      status: 'cancelled',
      cancelReason: reason || 'Cancelled by admin',
      cancelledAt: new Date(),
    });
  }

  /**
   * Checks if a specific room is available for a given date range.
   * @param {string|number} roomId - The ID of the room.
   * @param {string} checkInDate - The requested check-in date.
   * @param {string} checkOutDate - The requested check-out date.
   * @returns {Promise<boolean>} True if available, false otherwise.
   * @throws {Error} If missing required parameters.
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
   * Retrieves a list of available rooms for a given date range, optionally filtered by type.
   * @param {string} checkInDate - The desired check-in date.
   * @param {string} checkOutDate - The desired check-out date.
   * @param {string|number} [roomTypeId] - Optional filter for specific room type.
   * @returns {Promise<Array>} List of available rooms.
   * @throws {Error} If missing required dates.
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

  /**
   * Retrieves all bookings associated with a specific user.
   * @param {string|number} userId - The ID of the user.
   * @returns {Promise<Array>} Array of booking data for the user.
   * @throws {Error} If the user ID is not provided.
   */
  async getUserBookings(userId) {
    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      throw err;
    }

    return Booking.findAll({
      where: { userId },
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
   * Retrieves all bookings with extended admin-level filters and mappings.
   * @param {Object} query - The query parameters.
   * @param {string} [query.status] - The status to filter by.
   * @param {string} [query.search] - Search term matching user name or ID.
   * @param {string} [query.checkInDate] - Filter by check-in date.
   * @param {string} [query.checkOutDate] - Filter by check-out date.
   * @param {string|number} [query.userId] - Filter by user ID.
   * @param {number} [query.page=1] - The page number.
   * @param {number} [query.limit=10] - Number of items per page.
   * @returns {Promise<Object>} An object containing the mapped bookings and pagination details.
   */
  async getAllBookingsAdmin({
    status,
    search,
    checkInDate,
    checkOutDate,
    userId,
    page = 1,
    limit = 10,
  }) {
    const sanitizedPage = Math.max(1, parseInt(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const where = {};

    const statusMapping = {
      pending: 'pending',
      confirmed: 'confirmed',
      'checked-in': 'checked_in',
      'checked-out': 'checked_out',
      cancelled: 'cancelled',
    };
    if (status && statusMapping[status]) where.status = statusMapping[status];
    if (checkInDate && !isNaN(Date.parse(checkInDate)))
      where.checkInDate = { [Op.gte]: checkInDate };
    if (checkOutDate && !isNaN(Date.parse(checkOutDate)))
      where.checkOutDate = { [Op.lte]: checkOutDate };
    if (userId && !isNaN(parseInt(userId)) && parseInt(userId) > 0)
      where.userId = parseInt(userId);

    if (search) {
      const searchId = parseInt(search);
      if (!isNaN(searchId) && searchId > 0) {
        where.id = { [Op.eq]: searchId };
      } else {
        where[Op.or] = [{ '$user.fullName$': { [Op.iLike]: `%${search}%` } }];
      }
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
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
              attributes: ['id', 'name', 'maxCapacity'],
            },
          ],
          attributes: ['id', 'roomNumber', 'status'],
        },
        { model: Payment, as: 'payment' },
      ],
      order: [['id', 'DESC']],
      limit: sanitizedLimit,
      offset: (sanitizedPage - 1) * sanitizedLimit,
    });

    const responseStatusMapping = {
      pending: 'pending',
      confirmed: 'confirmed',
      checked_in: 'checked-in',
      checked_out: 'checked-out',
      cancelled: 'cancelled',
    };
    const mappedBookings = bookings.map((b) => ({
      ...b.toJSON(),
      status: responseStatusMapping[b.status] || b.status,
    }));

    return {
      bookings: mappedBookings,
      pagination: {
        currentPage: sanitizedPage,
        totalPages: Math.ceil(count / sanitizedLimit),
        totalItems: count,
        itemsPerPage: sanitizedLimit,
      },
    };
  }

  /**
   * Updates an existing booking.
   * @param {string|number} id - The ID of the booking to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated booking.
   * @throws {Error} If the booking is not found.
   */
  async updateBooking(id, data) {
    return this.update(id, data);
  }

  /**
   * Deletes a booking.
   * @param {string|number} id - The ID of the booking to delete.
   * @returns {Promise<Object>} The deleted booking.
   * @throws {Error} If the booking is not found.
   */
  async deleteBooking(id) {
    return this.delete(id);
  }
}

export default new BookingService();
