/**
 * @module BookingUtils
 * Shared booking utility functions.
 *
 * Responsibilities:
 * - Validate and cap booking stay duration
 * - Find available rooms for a requested date range
 * - Calculate room price based on nightly rate and stay length
 * - Check availability for a specific room
 * - Retrieve all available rooms for a date range
 */

import { Op } from 'sequelize';
import db from '#models/index.js';
import { MaxStayDays, OneDayInMs } from '#config/config.js';

const { Room, Booking, RoomType } = db;

/**
 * Utility class for booking-related business logic.
 *
 * These methods are separated from controllers/services so create/update
 * booking flows can reuse the same date, price, and availability rules.
 */
class BookingUtils {
  /**
   * Validates a check-in/check-out date pair and caps the stay length
   * when it exceeds MaxStayDays.
   *
   * The check-out date must be after the check-in date.
   *
   * If the requested duration is longer than MaxStayDays, the check-out date
   * is automatically moved to the maximum allowed date.
   *
   * @param {string|Date} checkInDate Requested check-in date
   * @param {string|Date} checkOutDate Requested check-out date
   *
   * @throws {Error} If check-out date is not after check-in date
   *
   * @returns {{ checkOutDate: string|Date, wasCapped: boolean }}
   * Normalized check-out date and whether the stay was capped
   */
  static resolveStayDuration(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffDays = Math.ceil((checkOut - checkIn) / OneDayInMs);

    if (diffDays <= 0) {
      throw new Error('Check-out date must be after check-in date.');
    }

    if (diffDays > MaxStayDays) {
      const cappedCheckOut = new Date(
        checkIn.getTime() + MaxStayDays * OneDayInMs,
      );

      return {
        checkOutDate: cappedCheckOut.toISOString(),
        wasCapped: true,
      };
    }

    return {
      checkOutDate,
      wasCapped: false,
    };
  }

  /**
   * Finds the first available room for a room type within a date range.
   *
   * Availability is based on overlapping bookings, not the room's current
   * realtime status. This prevents a room from looking unavailable forever
   * just because it is currently occupied today.
   *
   * A room is considered available when:
   * - It belongs to the requested room type
   * - It is not under maintenance
   * - It has no non-cancelled booking that overlaps the requested dates
   *
   * Overlap rule:
   * existing.checkInDate < requested.checkOutDate
   * existing.checkOutDate > requested.checkInDate
   *
   * @param {number|string} roomTypeId Room type ID
   * @param {string|Date} checkInDate Requested check-in date
   * @param {string|Date} checkOutDate Requested check-out date
   *
   * @returns {Promise<object|null>} First available room, or null if none exists
   */
  static async findAvailableRoom(roomTypeId, checkInDate, checkOutDate) {
    console.log({
      roomTypeId,
      checkInDate,
      checkOutDate,
    });

    const rooms = await Room.findAll({
      where: {
        roomTypeId,
        status: {
          [Op.ne]: 'maintenance',
        },
      },
      include: [
        {
          model: Booking,
          as: 'bookings',
          required: false,
        },
      ],
    });

    const availableRoom = rooms.find((room) => {
      return !room.bookings.some((booking) => {
        if (booking.status === 'cancelled') {
          return false;
        }

        return (
          new Date(booking.checkInDate) < new Date(checkOutDate) &&
          new Date(booking.checkOutDate) > new Date(checkInDate)
        );
      });
    });

    return availableRoom || null;
  }

  /**
   * Calculates the room price for a booking.
   *
   * Formula:
   * roomType.basePrice * numberOfNights
   *
   * Same-day check-in/check-out is treated as at least 1 night to avoid
   * returning 0 for the room portion of the total price.
   *
   * Extra services are not included here. This method only calculates the
   * room-price portion.
   *
   * @param {number|string} roomTypeId Room type ID
   * @param {string|Date} checkInDate Booking check-in date
   * @param {string|Date} checkOutDate Booking check-out date
   *
   * @throws {Error} If the room type does not exist
   *
   * @returns {Promise<number>} Total room price for the stay
   */
  static async calculateTotalPrice(roomTypeId, checkInDate, checkOutDate) {
    const roomType = await RoomType.findByPk(roomTypeId);

    if (!roomType) throw new Error('Room type not found');

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    const nights = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    );

    return parseFloat(roomType.basePrice) * nights;
  }

  /**
   * Checks whether a specific room is available for a date range.
   *
   * A room is unavailable when:
   * - The room does not exist
   * - The room is under maintenance
   * - The room has at least one non-cancelled overlapping booking
   *
   * @param {number|string} roomId Room ID
   * @param {string|Date} checkInDate Requested check-in date
   * @param {string|Date} checkOutDate Requested check-out date
   *
   * @returns {Promise<boolean>} True if the room is available
   */
  static async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    const room = await Room.findByPk(roomId);

    if (!room || room.status === 'maintenance') {
      return false;
    }

    const overlappingBookings = await Booking.count({
      where: {
        roomId,
        status: {
          [Op.notIn]: ['cancelled'],
        },
        [Op.and]: [
          { checkInDate: { [Op.lt]: checkOutDate } },
          { checkOutDate: { [Op.gt]: checkInDate } },
        ],
      },
    });

    return overlappingBookings === 0;
  }

  /**
   * Retrieves all available rooms for a date range.
   *
   * Optionally filters by room type.
   *
   * A room is returned only when:
   * - It is not under maintenance
   * - It has no non-cancelled overlapping bookings
   * - It matches the requested room type, if roomTypeId is provided
   *
   * @param {string|Date} checkInDate Requested check-in date
   * @param {string|Date} checkOutDate Requested check-out date
   * @param {number|string|null} [roomTypeId=null] Optional room type ID filter
   *
   * @returns {Promise<object[]>} List of available rooms
   */
  static async getAvailableRooms(checkInDate, checkOutDate, roomTypeId = null) {
    const roomWhere = {
      status: {
        [Op.ne]: 'maintenance',
      },
    };

    if (roomTypeId) {
      roomWhere.roomTypeId = roomTypeId;
    }

    const rooms = await Room.findAll({
      where: roomWhere,
      include: [
        {
          model: Booking,
          as: 'bookings',
          required: false,
          where: {
            status: {
              [Op.notIn]: ['cancelled'],
            },
            [Op.and]: [
              { checkInDate: { [Op.lt]: checkOutDate } },
              { checkOutDate: { [Op.gt]: checkInDate } },
            ],
          },
        },
      ],
    });

    return rooms.filter((room) => room.bookings.length === 0);
  }
}

export default BookingUtils;
