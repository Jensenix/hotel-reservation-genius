const { RoomType, Room, Facility } = require('../models');
const { Op } = require('sequelize');

class RoomTypeService {
  /**
   * Creates a room type.
   * @param {Object} data - Room type data.
   * @returns {Promise<Object>} Created room type.
   */
  async createRoomType({ name, description, basePrice, maxCapacity }) {
    if (!name || !basePrice || !maxCapacity) {
      const err = new Error('name, basePrice, and maxCapacity are required'); err.statusCode = 400; throw err;
    }
    return RoomType.create({ name, description, basePrice, maxCapacity });
  }

  /**
   * Retrieves room types.
   * @param {Object} query - Query params.
   * @returns {Promise<Array>} List of room types.
   */
  async getAllRoomTypes({ minPrice, maxPrice, search }) {
    const where = {};
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = minPrice;
      if (maxPrice) where.basePrice[Op.lte] = maxPrice;
    }
    if (search) where.name = { [Op.like]: `%${search}%` };

    return RoomType.findAll({
      where, order: [['createdAt', 'DESC']],
      include: [{ model: Facility, as: 'facilities' }, { model: Room, as: 'rooms' }]
    });
  }

  /**
   * Retrieves room types with facilities.
   * @returns {Promise<Array>} List of room types.
   */
  async getAllRoomTypesWithFacilities() {
    return RoomType.findAll({
      include: [{ model: Facility, as: 'facilities', through: { attributes: [] } }],
      order: [['basePrice', 'ASC']]
    });
  }

  /**
   * Retrieves a room type by ID.
   * @param {string|number} id - Room Type ID.
   * @returns {Promise<Object>} Room type data.
   */
  async getRoomTypeById(id) {
    const roomType = await RoomType.findByPk(id, { include: [{ model: Facility, as: 'facilities' }, { model: Room, as: 'rooms' }] });
    if (!roomType) { const err = new Error('Room type not found'); err.statusCode = 404; throw err; }
    return roomType;
  }

  /**
   * Updates a room type.
   * @param {string|number} id - Room Type ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated room type.
   */
  async updateRoomType(id, data) {
    const roomType = await RoomType.findByPk(id);
    if (!roomType) { const err = new Error('Room type not found'); err.statusCode = 404; throw err; }
    return roomType.update(data);
  }

  /**
   * Deletes a room type.
   * @param {string|number} id - Room Type ID.
   * @returns {Promise<void>}
   */
  async deleteRoomType(id) {
    const roomType = await RoomType.findByPk(id);
    if (!roomType) { const err = new Error('Room type not found'); err.statusCode = 404; throw err; }
    await roomType.destroy();
  }
}

module.exports = new RoomTypeService();