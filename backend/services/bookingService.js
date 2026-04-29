const { Booking, User, Room, Payment, Review, ExtraService, RoomType, PaymentMethod } = require('../models');
const { Op } = require('sequelize');
const BookingUtils = require('../utils/bookingUtils');

class BookingService {
  /**
   * Creates a new booking.
   * @param {Object} data - Booking data.
   * @returns {Promise<Object>} The created booking.
   */
  async createBooking({ userId, roomTypeId, checkInDate, checkOutDate, totalPrice, status }) {
    if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
      const err = new Error('userId, roomTypeId, checkInDate, and checkOutDate are required');
      err.statusCode = 400; throw err;
    }

    const availableRoom = await BookingUtils.findAvailableRoom(roomTypeId, checkInDate, checkOutDate);
    if (!availableRoom) {
      const err = new Error('All rooms of this type are fully booked for the selected dates');
      err.statusCode = 400; throw err;
    }

    let calculatedPrice = totalPrice || await BookingUtils.calculateTotalPrice(roomTypeId, checkInDate, checkOutDate);

    return Booking.create({
      userId,
      roomId: availableRoom.id,
      checkInDate,
      checkOutDate,
      totalPrice: calculatedPrice,
      status: status || 'pending'
    });
  }

  /**
   * Retrieves all bookings with pagination and filtering.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Bookings and pagination details.
   */
  async getAllBookings({ page = 1, limit = 10, status, userId, roomId }) {
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (roomId) where.roomId = roomId;

    const parsedLimit = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * parsedLimit;

    const { count, rows } = await Booking.findAndCountAll({
      where, offset, limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phoneNumber'] },
        { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] }
      ]
    });

    return {
      rows,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(count / parsedLimit),
        totalItems: count,
        itemsPerPage: parsedLimit
      }
    };
  }

  /**
   * Retrieves a specific booking by ID.
   * @param {string|number} id - Booking ID.
   * @returns {Promise<Object>} Booking details.
   */
  async getBookingById(id) {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
        { model: Payment, as: 'payment', include: [{ model: PaymentMethod, as: 'paymentMethod' }] },
        { model: Review, as: 'reviews' },
        { model: ExtraService, as: 'extraServices', through: { attributes: ['quantity', 'subtotal'] } }
      ]
    });

    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404; throw err;
    }
    return booking;
  }

  /**
   * Updates a booking.
   * @param {string|number} id - Booking ID.
   * @param {Object} data - Updated data.
   * @returns {Promise<Object>} Updated booking.
   */
  async updateBooking(id, data) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404; throw err;
    }
    return booking.update(data);
  }

  /**
   * Deletes a booking.
   * @param {string|number} id - Booking ID.
   * @returns {Promise<void>}
   */
  async deleteBooking(id) {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404; throw err;
    }
    await booking.destroy();
  }

  /**
   * Checks room availability.
   * @param {string|number} roomId - Room ID.
   * @param {string} checkInDate - Check-in date.
   * @param {string} checkOutDate - Check-out date.
   * @returns {Promise<boolean>} Availability status.
   */
  async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    if (!roomId || !checkInDate || !checkOutDate) {
      const err = new Error('roomId, checkInDate, and checkOutDate are required');
      err.statusCode = 400; throw err;
    }
    return BookingUtils.checkRoomAvailability(roomId, checkInDate, checkOutDate);
  }

  /**
   * Retrieves available rooms.
   * @param {string} checkInDate - Check-in date.
   * @param {string} checkOutDate - Check-out date.
   * @param {string|number} [roomTypeId] - Room type ID.
   * @returns {Promise<Array>} Available rooms.
   */
  async getAvailableRooms(checkInDate, checkOutDate, roomTypeId) {
    if (!checkInDate || !checkOutDate) {
      const err = new Error('checkInDate and checkOutDate are required');
      err.statusCode = 400; throw err;
    }
    return BookingUtils.getAvailableRooms(checkInDate, checkOutDate, roomTypeId);
  }

  /**
   * Confirms a booking.
   * @param {string|number} id - Booking ID.
   * @returns {Promise<Object>} Confirmed booking.
   */
  async confirmBooking(id) {
    const booking = await Booking.findByPk(id, { include: ['user', { model: Room, as: 'room', include: ['roomType'] }, 'payment'] });
    if (!booking) { const err = new Error('Booking not found'); err.statusCode = 404; throw err; }
    if (booking.status !== 'pending') { const err = new Error('Booking cannot be confirmed'); err.statusCode = 400; throw err; }
    return booking.update({ status: 'confirmed' });
  }

  /**
   * Checks in a guest.
   * @param {string|number} id - Booking ID.
   * @returns {Promise<Object>} Updated booking.
   */
  async checkInGuest(id) {
    const booking = await Booking.findByPk(id, { include: ['user', { model: Room, as: 'room', include: ['roomType'] }, 'payment'] });
    if (!booking) { const err = new Error('Booking not found'); err.statusCode = 404; throw err; }
    if (booking.status !== 'confirmed') { const err = new Error('Only confirmed bookings can be checked in'); err.statusCode = 400; throw err; }
    
    await booking.room.update({ status: 'occupied' });
    return booking.update({ status: 'checked_in', actualCheckIn: new Date() });
  }

  /**
   * Checks out a guest.
   * @param {string|number} id - Booking ID.
   * @returns {Promise<Object>} Updated booking.
   */
  async checkOutGuest(id) {
    const booking = await Booking.findByPk(id, { include: ['user', { model: Room, as: 'room', include: ['roomType'] }, 'payment'] });
    if (!booking) { const err = new Error('Booking not found'); err.statusCode = 404; throw err; }
    if (booking.status !== 'checked_in') { const err = new Error('Only checked-in guests can be checked out'); err.statusCode = 400; throw err; }

    await booking.room.update({ status: 'available' });
    return booking.update({ status: 'checked_out', actualCheckOut: new Date() });
  }

  /**
   * Cancels a booking.
   * @param {string|number} id - Booking ID.
   * @param {string} reason - Cancellation reason.
   * @returns {Promise<Object>} Cancelled booking.
   */
  async cancelBooking(id, reason) {
    const booking = await Booking.findByPk(id, { include: ['user', { model: Room, as: 'room', include: ['roomType'] }, 'payment'] });
    if (!booking) { const err = new Error('Booking not found'); err.statusCode = 404; throw err; }
    if (booking.status === 'checked_in') { const err = new Error('Cannot cancel checked-in booking'); err.statusCode = 400; throw err; }

    if (booking.room.status === 'occupied') await booking.room.update({ status: 'available' });
    return booking.update({ status: 'cancelled', cancelReason: reason || 'Cancelled by admin', cancelledAt: new Date() });
  }

  /**
   * Retrieves bookings for a user.
   * @param {string|number} userId - User ID.
   * @returns {Promise<Array>} User bookings.
   */
  async getUserBookings(userId) {
    if (!userId) { const err = new Error('User ID is required'); err.statusCode = 400; throw err; }
    return Booking.findAll({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phoneNumber'] },
        { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
        { model: Payment, as: 'payment', attributes: ['id', 'paymentMethodId', 'amount', 'paymentStatus', 'transactionTime'] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Retrieves all bookings with extended admin filters.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Admin filtered bookings.
   */
  async getAllBookingsAdmin({ status, search, checkInDate, checkOutDate, userId, page = 1, limit = 10 }) {
    const sanitizedPage = Math.max(1, parseInt(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const where = {};
    
    const statusMapping = { 'pending': 'pending', 'confirmed': 'confirmed', 'checked-in': 'checked_in', 'checked-out': 'checked_out', 'cancelled': 'cancelled' };
    if (status && statusMapping[status]) where.status = statusMapping[status];
    if (checkInDate && !isNaN(Date.parse(checkInDate))) where.checkInDate = { [Op.gte]: checkInDate };
    if (checkOutDate && !isNaN(Date.parse(checkOutDate))) where.checkOutDate = { [Op.lte]: checkOutDate };
    if (userId && !isNaN(parseInt(userId)) && parseInt(userId) > 0) where.userId = parseInt(userId);
    
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
        { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phoneNumber'] },
        { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'maxCapacity'] }], attributes: ['id', 'roomNumber', 'status'] },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']],
      limit: sanitizedLimit,
      offset: (sanitizedPage - 1) * sanitizedLimit
    });

    const responseStatusMapping = { 'pending': 'pending', 'confirmed': 'confirmed', 'checked_in': 'checked-in', 'checked_out': 'checked-out', 'cancelled': 'cancelled' };
    const mappedBookings = bookings.map(b => ({ ...b.toJSON(), status: responseStatusMapping[b.status] || b.status }));

    return {
      bookings: mappedBookings,
      pagination: { currentPage: sanitizedPage, totalPages: Math.ceil(count / sanitizedLimit), totalItems: count, itemsPerPage: sanitizedLimit }
    };
  }
}

module.exports = new BookingService();