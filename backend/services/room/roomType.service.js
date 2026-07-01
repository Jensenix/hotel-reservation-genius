import db from '#models/index.js';

const { RoomType, Room, Facility, Booking } = db;

import { Op } from 'sequelize';
import BaseService from '../base/base.service.js';

/**
 * RoomTypeService
 *
 * Handles business logic related to room types.
 *
 * Responsibilities:
 * - Create room types
 * - Retrieve room types
 * - Filter room types by price/search/date availability
 * - Manage room type relations
 *
 * Extends BaseService for common CRUD operations.
 */
class RoomTypeService extends BaseService {
  constructor() {
    super(RoomType, 'Room type');
  }

  /**
   * Create a new room type.
   *
   * Required fields:
   * - name
   * - basePrice
   * - maxCapacity
   *
   * @param {Object} data Room type data
   * @returns {Object} Created room type
   */
  async createRoomType({ name, description, basePrice, maxCapacity }) {
    if (!name || !basePrice || !maxCapacity) {
      const err = new Error('name, basePrice, and maxCapacity are required');

      err.statusCode = 400;
      throw err;
    }

    return super.create({
      name,
      description,
      basePrice,
      maxCapacity,
    });
  }

  /**
   * Retrieve all room types.
   *
   * Supports:
   * - Minimum price filter
   * - Maximum price filter
   * - Name search
   * - Date availability checking
   *
   * When dates are provided:
   * - Only checks rooms that are physically available
   * - Removes rooms with conflicting bookings
   *
   * @param {Object} filters
   * @returns {Array} Available room types
   */
  async getAllRoomTypes({ minPrice, maxPrice, search, checkIn, checkOut }) {
    const where = {};

    /**
     * Filter room types by price range.
     */
    if (minPrice || maxPrice) {
      where.basePrice = {};

      if (minPrice) {
        where.basePrice[Op.gte] = minPrice;
      }

      if (maxPrice) {
        where.basePrice[Op.lte] = maxPrice;
      }
    }

    /**
     * Search room type by name.
     */
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    /**
     * Include only rooms that are currently available.
     *
     * required: true means:
     * RoomType without available rooms
     * will not be returned.
     */
    const roomIncludeCondition = {
      model: Room,
      as: 'rooms',
      where: {
        status: 'available',
      },

      required: true,
    };

    /**
     * If user provides booking dates,
     * check overlapping reservations.
     */
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate < checkOutDate) {
        roomIncludeCondition.include = [
          {
            model: Booking,

            as: 'bookings',

            /**
             * Keep rooms even if no booking exists.
             */
            required: false,

            /**
             * Find bookings that overlap:
             *
             * booking.start < requested.checkout
             * booking.end > requested.checkin
             */
            where: {
              status: {
                [Op.ne]: 'cancelled',
              },

              checkInDate: {
                [Op.lt]: checkOutDate,
              },

              checkOutDate: {
                [Op.gt]: checkInDate,
              },
            },
          },
        ];
      }
    }

    const roomTypes = await super.getAll({
      where,

      /**
       * Needed because includes can duplicate rows.
       */
      distinct: true,

      order: [['basePrice', 'ASC']],

      include: [
        {
          model: Facility,
          as: 'facilities',
          through: {
            attributes: [],
          },
        },

        roomIncludeCondition,
      ],
    });

    /**
     * Extra filtering after Sequelize query.
     *
     * Removes room types where every room
     * has conflicting bookings.
     */
    if (checkIn && checkOut) {
      return roomTypes.filter((type) => {
        const availablePhysicalRooms = type.rooms?.filter(
          (room) => !room.bookings || room.bookings.length === 0,
        );

        return availablePhysicalRooms && availablePhysicalRooms.length > 0;
      });
    }

    return roomTypes;
  }

  /**
   * Retrieve all room types with facilities.
   *
   * Used for admin or management pages
   * where availability filtering is not required.
   *
   * @returns {Array}
   */
  async getAllRoomTypesWithFacilities() {
    return super.getAll({
      include: [
        {
          model: Facility,
          as: 'facilities',
          through: {
            attributes: [],
          },
        },
      ],

      order: [['basePrice', 'ASC']],
    });
  }

  /**
   * Retrieve room type detail.
   *
   * Includes:
   * - Facilities
   * - Rooms
   *
   * @param {number} id Room type ID
   */
  async getRoomTypeById(id) {
    return super.getById(
      id,

      {
        include: [
          {
            model: Facility,
            as: 'facilities',
          },

          {
            model: Room,
            as: 'rooms',
          },
        ],
      },
    );
  }

  /**
   * Update room type.
   *
   * @param {number} id Room type ID
   * @param {Object} data Updated fields
   */
  async updateRoomType(id, data) {
    return super.update(id, data);
  }

  /**
   * Delete room type.
   *
   * @param {number} id Room type ID
   */
  async deleteRoomType(id) {
    return super.delete(id);
  }
}

export default new RoomTypeService();
