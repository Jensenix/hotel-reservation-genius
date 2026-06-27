import db from '../models/index.js';
const { Booking, Room, RoomType } = db;

class BookingUtils {
  /**
   * Check if room is available for given dates
   * @param {number} roomId - Room ID
   * @param {Date} checkInDate - Check-in date
   * @param {Date} checkOutDate - Check-out date
   * @param {number} excludeBookingId - Exclude this booking ID from check (for updates)
   * @returns {Promise<boolean>}
   */
  static async checkRoomAvailability(
    roomId,
    checkInDate,
    checkOutDate,
    excludeBookingId = null,
  ) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      throw new Error('Check-in date must be before check-out date');
    }

    // Check for overlapping bookings (excluding cancelled ones)
    // Room is occupied if: checkInDate <= newCheckOut AND checkOutDate > newCheckIn
    // This allows same-day check-in after checkout (checkout at 12 PM, check-in at 2 PM)
    // If checkOutDate == newCheckIn, room is available
    const where = {
      roomId,
      status: { [require('sequelize').Op.ne]: 'cancelled' },
      checkInDate: { [require('sequelize').Op.lte]: checkOutDate },
      checkOutDate: { [require('sequelize').Op.gt]: checkInDate },
    };

    // Exclude current booking if updating
    if (excludeBookingId) {
      where.id = { [require('sequelize').Op.ne]: excludeBookingId };
    }

    const overlappingBookings = await Booking.findAll({ where });

    return overlappingBookings.length === 0;
  }

  /**
   * Calculate total price based on room type and duration
   * @param {number} roomTypeId - Room Type ID
   * @param {Date} checkInDate - Check-in date
   * @param {Date} checkOutDate - Check-out date
   * @returns {Promise<number>}
   */
  static async calculateTotalPrice(roomTypeId, checkInDate, checkOutDate) {
    const roomType = await RoomType.findByPk(roomTypeId);

    if (!roomType) {
      throw new Error('Room type not found');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate duration in days
    const durationInMs = checkOut - checkIn;
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

    if (durationInDays <= 0) {
      throw new Error('Invalid date range');
    }

    // Calculate total price
    const totalPrice = parseFloat(roomType.basePrice) * durationInDays;

    return totalPrice;
  }

  /**
   * Find first available room for given room type and dates
   * @param {number} roomTypeId - Room Type ID
   * @param {Date} checkInDate - Check-in date
   * @param {Date} checkOutDate - Check-out date
   * @returns {Promise<Object|null>}
   */
  static async findAvailableRoom(roomTypeId, checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      throw new Error('Check-in date must be before check-out date');
    }

    // Get all rooms of this type that are available
    const rooms = await Room.findAll({
      where: {
        roomTypeId,
        status: 'available',
      },
    });

    // Check each room for availability
    for (const room of rooms) {
      const isAvailable = await this.checkRoomAvailability(
        room.id,
        checkIn,
        checkOut,
      );
      if (isAvailable) {
        return room;
      }
    }

    return null; // No available rooms
  }

  /**
   * Get available rooms for given date range and room type
   * @param {Date} checkInDate - Check-in date
   * @param {Date} checkOutDate - Check-out date
   * @param {number} roomTypeId - Optional room type filter
   * @returns {Promise<Array>}
   */
  static async getAvailableRooms(checkInDate, checkOutDate, roomTypeId = null) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      throw new Error('Check-in date must be before check-out date');
    }

    // Get all rooms
    const where = { status: 'available' };

    if (roomTypeId) {
      where.roomTypeId = roomTypeId;
    }

    const allRooms = await Room.findAll({
      where,
      include: [
        {
          model: RoomType,
          as: 'roomType',
        },
      ],
    });

    // Filter out rooms with overlapping bookings
    const availableRooms = [];

    for (const room of allRooms) {
      const isAvailable = await this.checkRoomAvailability(
        room.id,
        checkIn,
        checkOut,
      );
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }
}

export default BookingUtils;
