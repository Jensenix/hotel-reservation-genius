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
  BookingExtraService,
} = db;
import { Op } from 'sequelize';
import BookingUtils from '#utils/bookingUtils.js';
import BaseService from '../base/base.service.js';
import { publish, CHANNELS } from '../websocket/eventPublisher.js';
import { RealtimeEvents } from '../../shared/eventContract.js';
import { MaxStayDays, OneDayInMs } from '#config/config.js';

class BookingService extends BaseService {
  constructor() {
    super(Booking, 'Booking');
  }

  async _applyExtraServices(booking, extraServicesPayload, baseTotal) {
    const items = (extraServicesPayload || []).filter(
      (item) => item && item.extraServiceId && Number(item.quantity) > 0,
    );

    const catalog = items.length
      ? await ExtraService.findAll({
          where: { id: items.map((item) => item.extraServiceId) },
        })
      : [];
    const priceById = new Map(catalog.map((s) => [s.id, Number(s.price)]));

    await BookingExtraService.destroy({ where: { bookingId: booking.id } });

    let extrasTotal = 0;
    const rows = [];
    for (const item of items) {
      const unitPrice = priceById.get(item.extraServiceId);
      if (unitPrice == null) continue; 
      const subtotal = unitPrice * Number(item.quantity);
      extrasTotal += subtotal;
      rows.push({
        bookingId: booking.id,
        extraServiceId: item.extraServiceId,
        quantity: item.quantity,
        subtotal,
      });
    }

    if (rows.length > 0) {
      await BookingExtraService.bulkCreate(rows);
    }

    const newTotal = Number(baseTotal) + extrasTotal;
    if (Number(booking.totalPrice) !== newTotal) {
      await booking.update({ totalPrice: newTotal });
    }

    return newTotal;
  }

  async createBooking({
    userId,
    roomTypeId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status,
    extraServices,
  }) {
    if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
      const err = new Error(
        'userId, roomTypeId, checkInDate, and checkOutDate are required',
      );
      err.statusCode = 400;
      throw err;
    }

    const checkIn = new Date(checkInDate);
    let checkOut = new Date(checkOutDate);
    
    let finalCheckOutDate = checkOutDate;
    let finalTotalPrice = totalPrice;

    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / OneDayInMs);

    if (diffDays <= 0) {
      throw new Error('Check-out date must be after check-in date.');
    }

    if (diffDays > MaxStayDays) {
      checkOut = new Date(checkIn.getTime() + MaxStayDays * OneDayInMs);
      finalCheckOutDate = checkOut.toISOString();
      finalTotalPrice = null; 
    }

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

    let calculatedPrice =
      finalTotalPrice ||
      (await BookingUtils.calculateTotalPrice(
        roomTypeId,
        checkInDate,
        finalCheckOutDate,
      ));

    const booking = await super.create({
      userId,
      roomId: availableRoom.id,
      checkInDate,
      checkOutDate: finalCheckOutDate,
      totalPrice: calculatedPrice,
      status: status || 'pending',
    });

    if (Array.isArray(extraServices) && extraServices.length > 0) {
      await this._applyExtraServices(booking, extraServices, calculatedPrice);
    }

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
        '[BookingService] Failed to publish booking_created event:',
        err.message,
      );
    }

    return booking;
  }

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

  async getBookingById(id) {
    const booking = await super.getById(id, {
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

    if (!booking) return booking;

    let extraServiceRows = [];
    try {
      extraServiceRows = await BookingExtraService.findAll({
        where: { bookingId: booking.id },
      });
    } catch (err) {
      console.error(
        '[BookingService] Failed to load selectedExtraServices for booking',
        booking.id,
        err.message,
      );
    }

    const plainBooking = booking.toJSON();
    plainBooking.selectedExtraServices = extraServiceRows.map((row) => ({
      id: row.extraServiceId,
      quantity: row.quantity,
      subtotal: row.subtotal,
    }));

    return plainBooking;
  }

  async updateBooking(id, data) {
    const { extraServices, ...rest } = data || {};

    if (rest.checkInDate && rest.checkOutDate) {
      const checkIn = new Date(rest.checkInDate);
      let checkOut = new Date(rest.checkOutDate);
      const diffDays = Math.ceil((checkOut - checkIn) / OneDayInMs);

      if (diffDays <= 0) {
        throw new Error('Check-out date must be after check-in date.');
      }

      if (diffDays > MaxStayDays) {
        checkOut = new Date(checkIn.getTime() + MaxStayDays * OneDayInMs);
        rest.checkOutDate = checkOut.toISOString();
        
        const bookingToUpdate = await this.model.findByPk(id, {
          include: [{ model: Room, as: 'room' }]
        });
        if (bookingToUpdate && bookingToUpdate.room) {
          rest.totalPrice = await BookingUtils.calculateTotalPrice(
            bookingToUpdate.room.roomTypeId,
            rest.checkInDate,
            rest.checkOutDate
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
        const baseTotal = rest.totalPrice ?? updatedBooking.totalPrice;
        await this._applyExtraServices(updatedBooking, extraServices, baseTotal);
      }
    }

    return updatedBooking;
  }

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
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish booking_confirmed event:',
        err.message,
      );
    }

    return updatedBooking;
  }

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
    const updatedBooking = await booking.update({
      status: 'checked_in',
      actualCheckIn: new Date(),
    });

    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      await publish(CHANNELS.ROOM, {
        event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
        data: { roomId: booking.room.id, status: 'occupied' },
        rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish check-in events:',
        err.message,
      );
    }

    return updatedBooking;
  }

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
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      await publish(CHANNELS.ROOM, {
        event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
        data: { roomId: booking.room.id, status: 'available' },
        rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish check-out events:',
        err.message,
      );
    }

    return updatedBooking;
  }

  async cancelBookingByAdmin(id, reason) {
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

    const wasOccupied = booking.room && booking.room.status === 'occupied';

    if (wasOccupied) {
      await booking.room.update({ status: 'available' });
    }

    const updatedBooking = await booking.update({
      status: 'cancelled',
      cancelReason: reason || 'Cancelled by admin',
      cancelledAt: new Date(),
    });

    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      if (wasOccupied) {
        await publish(CHANNELS.ROOM, {
          event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
          data: { roomId: booking.room.id, status: 'available' },
          rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
        });
      }
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish admin cancel event:',
        err.message,
      );
    }

    return updatedBooking;
  }

  async cancelBookingByUser(id, reason, userId) {
    const booking = await super.getById(id, {
      include: [
        'user',
        { model: Room, as: 'room', include: ['roomType'] },
        'payment',
      ],
    });

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
      await booking.room.update({ status: 'available' });
    }

    const updatedBooking = await booking.update({
      status: 'cancelled',
      cancelReason: reason || 'Cancelled by user',
      cancelledAt: new Date(),
    });

    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      if (wasOccupied) {
        await publish(CHANNELS.ROOM, {
          event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
          data: { roomId: booking.room.id, status: 'available' },
          rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
        });
      }
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish user cancel event:',
        err.message,
      );
    }

    return updatedBooking;
  }

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

  async deleteBooking(id) {
    return this.delete(id);
  }

  async selfCheckIn(bookingId, userId) {
    const booking = await this.model.findByPk(bookingId, {
      include: [{ model: Room, as: 'room' }],
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
      await booking.room.update({ status: 'occupied' });
    }

    const updatedBooking = await this.update(bookingId, {
      status: 'checked_in',
      actualCheckIn: new Date(),
    });

    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      if (booking.room) {
        await publish(CHANNELS.ROOM, {
          event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
          data: { roomId: booking.room.id, status: 'occupied' },
          rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
        });
      }
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish self check-in event:',
        err.message,
      );
    }

    return updatedBooking;
  }

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

    // Allow self-checkout on the scheduled date OR any day after it.
    // Previously this rejected checkout once the exact day had passed,
    // which permanently blocked self-checkout and left the room stuck
    // as 'occupied' with no automatic way to release it.

    if (booking.room) {
      await booking.room.update({ status: 'available' });
    }

    const updatedBooking = await this.update(bookingId, {
      status: 'checked_out',
      actualCheckOut: new Date(),
    });

    try {
      await publish(CHANNELS.BOOKING, {
        event: RealtimeEvents.BOOKING.STATUS_CHANGED,
        data: {
          bookingId: updatedBooking.id,
          status: updatedBooking.status,
        },
        rooms: [`user:${updatedBooking.userId}`, 'admin:dashboard'],
      });

      if (booking.room) {
        await publish(CHANNELS.ROOM, {
          event: RealtimeEvents.ROOM.AVAILABILITY_CHANGED,
          data: { roomId: booking.room.id, status: 'available' },
          rooms: [`room:${booking.room.id}`, 'admin:dashboard'],
        });
      }
    } catch (err) {
      console.error(
        '[BookingService] Failed to publish self check-out events:',
        err.message,
      );
    }

    return updatedBooking;
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