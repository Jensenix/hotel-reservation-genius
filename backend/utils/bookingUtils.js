import { Op } from 'sequelize';
import db from '#models/index.js';

const { Room, Booking, RoomType } = db;

class BookingUtils {
  /**
   * Finds the first available room of a specific type for the given dates.
   * Availability is based on overlapping bookings, NOT the current realtime room status.
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
   * Calculates the total price based on the room type's base price and duration of stay.
   */
  static async calculateTotalPrice(roomTypeId, checkInDate, checkOutDate) {
    const roomType = await RoomType.findByPk(roomTypeId);
    if (!roomType) throw new Error('Room type not found');

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // Calculate nights, defaulting to at least 1 night for same-day check-in/out scenarios
    const nights = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    );

    return parseFloat(roomType.basePrice) * nights;
  }

  /**
   * Checks if a specific room is available for the given dates.
   */
  static async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    const room = await Room.findByPk(roomId);

    if (!room || room.status === 'maintenance') {
      return false;
    }

    const overlappingBookings = await Booking.count({
      where: {
        roomId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.and]: [
          { checkInDate: { [Op.lt]: checkOutDate } },
          { checkOutDate: { [Op.gt]: checkInDate } },
        ],
      },
    });

    return overlappingBookings === 0;
  }

  /**
   * Retrieves all available rooms for a given date range, optionally filtered by type.
   */
  static async getAvailableRooms(checkInDate, checkOutDate, roomTypeId = null) {
    const roomWhere = {
      status: { [Op.ne]: 'maintenance' },
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
            status: { [Op.notIn]: ['cancelled'] },
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
