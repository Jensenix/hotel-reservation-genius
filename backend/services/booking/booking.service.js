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
import { publish, CHANNELS } from '../websocket/eventPublisher.js';

class BookingService extends BaseService {
  constructor() {
    super(Booking, 'Booking');
  }

  /**
   * Creates a new booking with business logic for finding available rooms and calculating price.
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

    const booking = await super.create({
      userId,
      roomId: availableRoom.id,
      checkInDate,
      checkOutDate,
      totalPrice: calculatedPrice,
      status: status || 'pending',
    });

    try {
      const payload = {
        bookingId: booking.id,
        userId: booking.userId,
        roomId: booking.roomId,
        status: booking.status,
      };
      await publish(CHANNELS.BOOKING, { event: 'booking_created', data: payload, room: `user:${booking.userId}` });
      await publish(CHANNELS.BOOKING, { event: 'booking_created', data: payload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[BookingService] Failed to publish booking_created event:', err.message);
    }

    return booking;
  }

  /**
   * Retrieves all bookings with pagination and filtering.
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

    const updatedBooking = await booking.update({ status: 'confirmed' });

    try {
      const payload = { bookingId: updatedBooking.id, status: updatedBooking.status };
      await publish(CHANNELS.BOOKING, { event: 'booking_confirmed', data: payload, room: `user:${updatedBooking.userId}` });
      await publish(CHANNELS.BOOKING, { event: 'booking_confirmed', data: payload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[BookingService] Failed to publish booking_confirmed event:', err.message);
    }

    return updatedBooking;
  }

  /**
   * Checks in a guest and marks the room as occupied.
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
    const updatedBooking = await booking.update({ status: 'checked_in', actualCheckIn: new Date() });

    try {
      const bookingPayload = { bookingId: updatedBooking.id, status: updatedBooking.status };
      await publish(CHANNELS.BOOKING, { event: 'booking_status_changed', data: bookingPayload, room: `user:${updatedBooking.userId}` });
      await publish(CHANNELS.BOOKING, { event: 'booking_status_changed', data: bookingPayload, room: 'admin:dashboard' });

      const roomPayload = { roomId: booking.room.id, status: 'occupied' };
      await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: roomPayload, room: `room:${booking.room.id}` });
      await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: roomPayload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[BookingService] Failed to publish check-in events:', err.message);
    }

    return updatedBooking;
  }

  /**
   * Checks out a guest and marks the room as available.
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
    const updatedBooking = await booking.update({
      status: 'checked_out',
      actualCheckOut: new Date(),
    });

    try {
      const bookingPayload = { bookingId: updatedBooking.id, status: updatedBooking.status };
      await publish(CHANNELS.BOOKING, { event: 'booking_status_changed', data: bookingPayload, room: `user:${updatedBooking.userId}` });
      await publish(CHANNELS.BOOKING, { event: 'booking_status_changed', data: bookingPayload, room: 'admin:dashboard' });

      const roomPayload = { roomId: booking.room.id, status: 'available' };
      await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: roomPayload, room: `room:${booking.room.id}` });
      await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: roomPayload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[BookingService] Failed to publish check-out events:', err.message);
    }

    return updatedBooking;
  }

  /**
   * Cancels a booking, freeing up the room if it was occupied.
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

    const updatedBooking = await booking.update({
      status: 'cancelled',
      cancelReason: reason || 'Cancelled by admin',
      cancelledAt: new Date(),
    });

    try {
      const payload = { bookingId: updatedBooking.id, status: updatedBooking.status };
      await publish(CHANNELS.BOOKING, { event: 'booking_cancelled', data: payload, room: `user:${updatedBooking.userId}` });
      await publish(CHANNELS.BOOKING, { event: 'booking_cancelled', data: payload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[BookingService] Failed to publish booking_cancelled event:', err.message);
    }

    return updatedBooking;
  }

  /**
   * Checks if a specific room is available for a given date range.
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
   */
  async updateBooking(id, data) {
    return this.update(id, data);
  }

  /**
   * Deletes a booking.
   */
  async deleteBooking(id) {
    return this.delete(id);
  }

  /**
   * Processes a user-initiated self check-in.
   */
  async selfCheckIn(bookingId, userId) {
    const booking = await this.model.findByPk(bookingId);

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

    return await this.update(bookingId, { status: 'checked_in' });
  }

  /**
   * Processes a user-initiated self check-out.
   */
  async selfCheckOut(bookingId, userId) {
    const booking = await this.model.findByPk(bookingId, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!booking) throw new Error('Booking not found');

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

    if (checkOutDate < today) {
      const err = new Error(
        'Your checkout date has passed. Please contact the admin to assist you with the checkout process.',
      );
      err.statusCode = 400;
      throw err;
    }

    if (booking.room) {
      await booking.room.update({ status: 'available' });
    }
    return await this.update(bookingId, {
      status: 'checked_out',
      actualCheckOut: new Date(),
    });
  }

  async processAutomatedCheckouts() {
    const expiredBookings = await this.model.findAll({
      where: {
        status: 'checked_in',
        checkOutDate: { [Op.lt]: new Date() },
      },
    });

    for (const booking of expiredBookings) {
      await this.checkOutGuest(booking.id);
      console.log(`Auto-checkout performed for booking ${booking.id}`);
    }
  }
}

export default new BookingService();