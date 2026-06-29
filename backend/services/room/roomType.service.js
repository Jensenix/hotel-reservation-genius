import db from '#models/index.js';
const { RoomType, Room, Facility, Booking } = db;
import { Op } from 'sequelize';
import BaseService from '../base/base.service.js';

class RoomTypeService extends BaseService {
  constructor() {
    super(RoomType, 'Room type');
  }

  async createRoomType({ name, description, basePrice, maxCapacity }) {
    if (!name || !basePrice || !maxCapacity) {
      const err = new Error('name, basePrice, and maxCapacity are required');
      err.statusCode = 400;
      throw err;
    }
    return super.create({ name, description, basePrice, maxCapacity });
  }

  /**
   * Retrieves all room types with filtering for price, search terms, and active date ranges.
   */
  async getAllRoomTypes({ minPrice, maxPrice, search, checkIn, checkOut }) {
    const where = {};
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = minPrice;
      if (maxPrice) where.basePrice[Op.lte] = maxPrice;
    }
    if (search) where.name = { [Op.like]: `%${search}%` };

    const roomIncludeCondition = {
      model: Room,
      as: 'rooms',
      where: { status: 'available' },
      required: true, // Only return RoomTypes that possess physically available inventory
    };

    // If explicit vacation dates are queried from the frontend
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate < checkOutDate) {
        roomIncludeCondition.include = [
          {
            model: Booking,
            as: 'bookings',
            required: false, // Left Join bookings
            where: {
              status: { [Op.ne]: 'cancelled' },
              checkInDate: { [Op.lt]: checkOutDate },
              checkOutDate: { [Op.gt]: checkInDate },
            },
          },
        ];
      }
    }

    const roomTypes = await super.getAll({
      where,
      distinct: true, // Required to fix Sequelize Count mapping when using Includes
      order: [['basePrice', 'ASC']],
      include: [
        { model: Facility, as: 'facilities', through: { attributes: [] } },
        roomIncludeCondition,
      ],
    });

    // If dates are provided, post-filter out rooms that have overlapping bookings 
    // This ensures only RoomTypes that actually have an empty room for those dates display
    if (checkIn && checkOut) {
      return roomTypes.filter((type) => {
        // A room is truly available if it has NO overlapping bookings returned by the subquery
        const availablePhysicalRooms = type.rooms?.filter(
          (room) => !room.bookings || room.bookings.length === 0
        );
        return availablePhysicalRooms && availablePhysicalRooms.length > 0;
      });
    }

    return roomTypes;
  }

  async getAllRoomTypesWithFacilities() {
    return super.getAll({
      include: [
        { model: Facility, as: 'facilities', through: { attributes: [] } },
      ],
      order: [['basePrice', 'ASC']],
    });
  }

  async getRoomTypeById(id) {
    return super.getById(id, {
      include: [
        { model: Facility, as: 'facilities' },
        { model: Room, as: 'rooms' },
      ],
    });
  }

  async updateRoomType(id, data) {
    return super.update(id, data);
  }

  async deleteRoomType(id) {
    return super.delete(id);
  }
}

export default new RoomTypeService();