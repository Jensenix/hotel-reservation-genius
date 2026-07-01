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
import BookingEvents from '#utils/bookingEvents.js';
import BaseService from '../base/base.service.js';
import bookingLifecycle from './bookingLifecycle.service.js';

class BookingService extends BaseService {
  constructor() {
    super(Booking, 'Booking');
  }

  /**
   * Applies extra services to a booking and updates the total price.
   * @param {Object} booking 
   * @param {Array} extraServicesPayload 
   * @param {number} baseTotal 
   * @returns {Promise<number>}
   */
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

    await BookingEvents.bookingCreated(booking);

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
      const { checkOutDate: finalCheckOutDate, wasCapped } =
        BookingUtils.resolveStayDuration(rest.checkInDate, rest.checkOutDate);
      rest.checkOutDate = finalCheckOutDate;

      if (wasCapped) {
        const bookingToUpdate = await this.model.findByPk(id, {
          include: [{ model: Room, as: 'room' }],
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
        const baseTotal = rest.totalPrice ?? updatedBooking.totalPrice;
        await this._applyExtraServices(
          updatedBooking,
          extraServices,
          baseTotal,
        );
      }
    }

    return updatedBooking;
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

  confirmBooking(id) {
    return bookingLifecycle.confirmBooking(id);
  }

  checkInGuest(id) {
    return bookingLifecycle.checkInGuest(id);
  }

  checkOutGuest(id) {
    return bookingLifecycle.checkOutGuest(id);
  }

  cancelBookingByAdmin(id, reason) {
    return bookingLifecycle.cancelBookingByAdmin(id, reason);
  }

  cancelBookingByUser(id, reason, userId) {
    return bookingLifecycle.cancelBookingByUser(id, reason, userId);
  }

  selfCheckIn(bookingId, userId) {
    return bookingLifecycle.selfCheckIn(bookingId, userId);
  }

  selfCheckOut(bookingId, userId) {
    return bookingLifecycle.selfCheckOut(bookingId, userId);
  }

  processAutomatedCheckouts() {
    return bookingLifecycle.processAutomatedCheckouts();
  }
}

export default new BookingService();
