import db from '../models/index.js';
const { Room, RoomType, Booking } = db;
import { Op } from 'sequelize';

class RoomAvailabilityService {
  /**
   * Retrieves overall room availability.
   * @param {string} [date] - Target date.
   * @returns {Promise<Object>} Availability data.
   */
  async getRoomAvailability(date) {
    const targetDate = date ? new Date(date) : new Date();
    const roomTypes = await RoomType.findAll({
      include: [
        {
          model: Room,
          as: 'rooms',
          attributes: ['id', 'roomNumber', 'status', 'floor'],
        },
      ],
      order: [['basePrice', 'ASC']],
    });

    const availabilityData = await Promise.all(
      roomTypes.map(async (roomType) => {
        const totalPhysicalRooms = roomType.rooms.length;

        const bookings = await Booking.findAll({
          include: [
            {
              model: Room,
              as: 'room',
              where: { roomTypeId: roomType.id },
              attributes: ['id', 'roomNumber', 'status'],
            },
          ],
          where: {
            status: { [Op.in]: ['confirmed', 'checked_in'] },
            checkInDate: { [Op.lte]: targetDate },
            checkOutDate: { [Op.gt]: targetDate },
          },
        });

        const bookedRoomIds = bookings.map((b) => b.roomId);
        const maintenanceRooms = roomType.rooms.filter(
          (r) => r.status === 'maintenance',
        ).length;
        const cleaningRooms = roomType.rooms.filter(
          (r) => r.status === 'cleaning',
        ).length;
        const availableRooms = roomType.rooms.filter(
          (r) => !bookedRoomIds.includes(r.id) && r.status === 'available',
        ).length;
        const occupiedRooms = roomType.rooms.filter(
          (r) => bookedRoomIds.includes(r.id) || r.status === 'occupied',
        ).length;

        return {
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          basePrice: roomType.basePrice,
          maxCapacity: roomType.maxCapacity,
          totalRooms: totalPhysicalRooms,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          cleaningRooms,
          availabilityPercentage:
            totalPhysicalRooms > 0
              ? Math.round((availableRooms / totalPhysicalRooms) * 100)
              : 0,
          bookedRoomsCount: bookedRoomIds.length,
          rooms: roomType.rooms.map((room) => {
            const isBooked = bookedRoomIds.includes(room.id);
            return {
              id: room.id,
              roomNumber: room.roomNumber,
              status: isBooked ? 'occupied' : room.status,
              floor: room.floor,
              isBooked: isBooked,
            };
          }),
        };
      }),
    );

    const overall = {
      totalRooms: roomTypes.reduce((sum, rt) => sum + rt.rooms.length, 0),
      availableRooms: availabilityData.reduce(
        (sum, rt) => sum + rt.availableRooms,
        0,
      ),
      occupiedRooms: availabilityData.reduce(
        (sum, rt) => sum + rt.occupiedRooms,
        0,
      ),
      maintenanceRooms: availabilityData.reduce(
        (sum, rt) => sum + rt.maintenanceRooms,
        0,
      ),
      cleaningRooms: availabilityData.reduce(
        (sum, rt) => sum + rt.cleaningRooms,
        0,
      ),
    };
    overall.availabilityRate =
      overall.totalRooms > 0
        ? Math.round((overall.availableRooms / overall.totalRooms) * 100)
        : 0;
    overall.occupancyRate =
      overall.totalRooms > 0
        ? Math.round((overall.occupiedRooms / overall.totalRooms) * 100)
        : 0;

    return {
      date: targetDate.toISOString().split('T')[0],
      overall,
      byRoomType: availabilityData,
    };
  }

  /**
   * Retrieves availability for a specific room type.
   * @param {string|number} roomTypeId - Room type ID.
   * @param {string} [date] - Target date.
   * @returns {Promise<Object>} Detailed availability.
   */
  async getRoomTypeAvailability(roomTypeId, date) {
    const roomType = await RoomType.findByPk(roomTypeId, {
      include: [
        {
          model: Room,
          as: 'rooms',
          where: date ? {} : undefined,
          include: [
            {
              model: Booking,
              as: 'bookings',
              required: false,
              where: date
                ? {
                    status: { [Op.in]: ['confirmed', 'checked_in'] },
                    [Op.or]: [
                      {
                        checkInDate: { [Op.lte]: new Date(date) },
                        checkOutDate: { [Op.gt]: new Date(date) },
                      },
                      {
                        checkInDate: { [Op.lte]: new Date(date) },
                        checkOutDate: { [Op.gte]: new Date(date) },
                      },
                    ],
                  }
                : undefined,
            },
          ],
        },
      ],
    });

    if (!roomType) {
      const err = new Error('Room type not found');
      err.statusCode = 404;
      throw err;
    }

    return {
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      basePrice: parseFloat(roomType.basePrice),
      rooms: roomType.rooms.map((room) => {
        const isBooked = room.bookings && room.bookings.length > 0;
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          status: isBooked ? 'occupied' : room.status,
          floor: room.floor,
          isBooked: isBooked,
        };
      }),
    };
  }
}

export default new RoomAvailabilityService();
