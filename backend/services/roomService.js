const { Room, RoomType, Booking } = require('../models');
const pagination = require('../utils/pagination');

class RoomService {
  /**
   * Creates a new room.
   * @param {Object} data - Room data.
   * @returns {Promise<Object>} Created room.
   */
  async createRoom({ roomNumber, roomTypeId, floor, status }) {
    if (!roomNumber || !roomTypeId) {
      const err = new Error('roomNumber and roomTypeId are required'); err.statusCode = 400; throw err;
    }

    const existingRoom = await Room.findOne({ where: { roomNumber } });
    if (existingRoom) {
      const err = new Error('Room number already exists'); err.statusCode = 400; throw err;
    }

    return Room.create({ roomNumber, roomTypeId, floor, status: status || 'available' });
  }

  /**
   * Retrieves all rooms with pagination.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Paginated rooms.
   */
  async getAllRooms({ page = 1, limit, status, roomTypeId, floor }) {
    const where = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;
    if (floor) where.floor = floor;

    const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);
    const { count, rows } = await Room.findAndCountAll({
      where, offset, limit: parsedLimit, order: [['createdAt', 'DESC']],
      include: [{ model: RoomType, as: 'roomType' }, { model: Booking, as: 'bookings' }]
    });

    return { rows, pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit) };
  }

  /**
   * Retrieves a specific room by ID.
   * @param {string|number} id - Room ID.
   * @returns {Promise<Object>} Room data.
   */
  async getRoomById(id) {
    const room = await Room.findByPk(id, {
      include: [{ model: RoomType, as: 'roomType' }, { model: Booking, as: 'bookings' }]
    });
    if (!room) {
      const err = new Error('Room not found'); err.statusCode = 404; throw err;
    }
    return room;
  }

  /**
   * Updates an existing room.
   * @param {string|number} id - Room ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated room.
   */
  async updateRoom(id, data) {
    const room = await Room.findByPk(id);
    if (!room) {
      const err = new Error('Room not found'); err.statusCode = 404; throw err;
    }

    if (data.roomNumber && data.roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ where: { roomNumber: data.roomNumber } });
      if (existingRoom) {
        const err = new Error('Room number already exists'); err.statusCode = 400; throw err;
      }
    }

    return room.update(data);
  }

  /**
   * Deletes a room.
   * @param {string|number} id - Room ID.
   * @returns {Promise<void>}
   */
  async deleteRoom(id) {
    const room = await Room.findByPk(id);
    if (!room) {
      const err = new Error('Room not found'); err.statusCode = 404; throw err;
    }
    await room.destroy();
  }

  /**
   * Retrieves all rooms with basic room type data.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Array>} List of rooms.
   */
  async getAllWithRoomType({ status, roomTypeId }) {
    const where = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;

    return Room.findAll({
      where,
      include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'description', 'basePrice', 'maxCapacity'] }],
      order: [['floor', 'ASC'], ['roomNumber', 'ASC']]
    });
  }
}

module.exports = new RoomService();