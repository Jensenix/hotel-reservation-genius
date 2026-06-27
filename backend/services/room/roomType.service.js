import db from '#models/index.js';
const { RoomType, Room, Facility } = db;
import { Op } from 'sequelize';
import BaseService from '../base/base.service.js';

class RoomTypeService extends BaseService {
  constructor() {
    super(RoomType, 'Room type');
  }

  /**
   * Creates a new room type.
   * @param {Object} data - Room type details.
   * @param {string} data.name - Name of the room type.
   * @param {string} [data.description] - Description of the room type.
   * @param {number} data.basePrice - Base price for the room type.
   * @param {number} data.maxCapacity - Maximum capacity of the room.
   * @returns {Promise<Object>} The newly created room type.
   * @throws {Error} If required fields are missing.
   */
  async createRoomType({ name, description, basePrice, maxCapacity }) {
    if (!name || !basePrice || !maxCapacity) {
      const err = new Error('name, basePrice, and maxCapacity are required');
      err.statusCode = 400;
      throw err;
    }
    return super.create({ name, description, basePrice, maxCapacity });
  }

  /**
   * Retrieves all room types with optional filtering for price and search terms.
   * @param {Object} query - The query parameters.
   * @param {number} [query.minPrice] - Minimum base price filter.
   * @param {number} [query.maxPrice] - Maximum base price filter.
   * @param {string} [query.search] - Search term for room type names.
   * @returns {Promise<Array>} List of matching room types.
   */
  async getAllRoomTypes({ minPrice, maxPrice, search }) {
    const where = {};
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = minPrice;
      if (maxPrice) where.basePrice[Op.lte] = maxPrice;
    }
    if (search) where.name = { [Op.like]: `%${search}%` };

    return super.getAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Facility, as: 'facilities' },
        { model: Room, as: 'rooms' },
      ],
    });
  }

  /**
   * Retrieves all room types along with their associated facilities.
   * @returns {Promise<Array>} List of room types and their facilities.
   */
  async getAllRoomTypesWithFacilities() {
    return super.getAll({
      include: [
        { model: Facility, as: 'facilities', through: { attributes: [] } },
      ],
      order: [['basePrice', 'ASC']],
    });
  }

  /**
   * Retrieves a specific room type by its ID.
   * @param {string|number} id - The ID of the room type.
   * @returns {Promise<Object>} The room type details with facilities and rooms.
   * @throws {Error} If the room type is not found.
   */
  async getRoomTypeById(id) {
    return super.getById(id, {
      include: [
        { model: Facility, as: 'facilities' },
        { model: Room, as: 'rooms' },
      ],
    });
  }

  /**
   * Updates an existing room type.
   * @param {string|number} id - The ID of the room type.
   * @param {Object} data - The room type attributes to update.
   * @returns {Promise<Object>} The updated room type.
   * @throws {Error} If the room type is not found.
   */
  async updateRoomType(id, data) {
    return super.update(id, data);
  }

  /**
   * Deletes a room type by its ID.
   * @param {string|number} id - The ID of the room type.
   * @returns {Promise<void>}
   * @throws {Error} If the room type is not found.
   */
  async deleteRoomType(id) {
    return super.delete(id);
  }
}

export default new RoomTypeService();
