import db from '#models/index.js';
const { Room, RoomType, Booking } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/baseService.js';

class RoomService extends BaseService {
  constructor() {
    super(Room, 'Room');
  }

  /**
   * Creates a new room.
   * @param {Object} data - Room details.
   * @param {string} data.roomNumber - The room number.
   * @param {string|number} data.roomTypeId - The ID of the associated room type.
   * @param {number} data.floor - The floor number.
   * @param {string} [data.status] - The initial status of the room (defaults to 'available').
   * @returns {Promise<Object>} The created room.
   * @throws {Error} If required fields are missing or the room number already exists.
   */
  async createRoom({ roomNumber, roomTypeId, floor, status }) {
    if (!roomNumber || !roomTypeId) {
      const err = new Error('roomNumber and roomTypeId are required');
      err.statusCode = 400;
      throw err;
    }

    const existingRoom = await Room.findOne({ where: { roomNumber } });
    if (existingRoom) {
      const err = new Error('Room number already exists');
      err.statusCode = 400;
      throw err;
    }

    return super.create({
      roomNumber,
      roomTypeId,
      floor,
      status: status || 'available',
    });
  }

  /**
   * Retrieves all rooms with optional pagination and filtering.
   * @param {Object} query - The query parameters.
   * @param {number} [query.page=1] - The page number.
   * @param {number} [query.limit] - The number of records per page.
   * @param {string} [query.status] - Filter by room status.
   * @param {string|number} [query.roomTypeId] - Filter by room type.
   * @param {number} [query.floor] - Filter by floor.
   * @returns {Promise<Object>} An object containing the rows and pagination details.
   */
  async getAllRooms({ page = 1, limit, status, roomTypeId, floor }) {
    const where = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;
    if (floor) where.floor = floor;

    // Jika limit tidak diset, ambil semua (no pagination)
    if (!limit) {
      const result = await super.getAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          { model: RoomType, as: 'roomType' },
          { model: Booking, as: 'bookings' },
        ],
      });
      return result; // Return array langsung
    }

    // Jika limit diset, gunakan pagination
    const { offset, limit: parsedLimit } = pagination.getPagination(
      page,
      limit,
    );
    const { count, rows } = await super.getAll({
      where,
      offset,
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: RoomType, as: 'roomType' },
        { model: Booking, as: 'bookings' },
      ],
    });

    return {
      rows,
      pagination: pagination.getPagingData(
        { count, rows },
        parseInt(page),
        parsedLimit,
      ),
    };
  }

  /**
   * Retrieves a specific room by its ID.
   * @param {string|number} id - The ID of the room.
   * @returns {Promise<Object>} The room data with associated room type and bookings.
   * @throws {Error} If the room is not found.
   */
  async getRoomById(id) {
    return super.getById(id, {
      include: [
        { model: RoomType, as: 'roomType' },
        { model: Booking, as: 'bookings' },
      ],
    });
  }

  /**
   * Updates an existing room's details.
   * @param {string|number} id - The ID of the room to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated room.
   * @throws {Error} If the room is not found or the new room number already exists.
   */
  async updateRoom(id, data) {
    const room = await super.getById(id);

    if (data.roomNumber && data.roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({
        where: { roomNumber: data.roomNumber },
      });
      if (existingRoom) {
        const err = new Error('Room number already exists');
        err.statusCode = 400;
        throw err;
      }
    }

    return room.update(data);
  }

  /**
   * Deletes a room by its ID.
   * @param {string|number} id - The ID of the room.
   * @returns {Promise<void>}
   * @throws {Error} If the room is not found.
   */
  async deleteRoom(id) {
    return super.delete(id);
  }

  /**
   * Retrieves all rooms, including their associated room type data.
   * @param {Object} query - The query parameters.
   * @param {string} [query.status] - Optional status filter.
   * @param {string|number} [query.roomTypeId] - Optional room type ID filter.
   * @returns {Promise<Array>} List of rooms with basic room type info.
   */
  async getAllWithRoomType({ status, roomTypeId }) {
    const where = {};
    if (status) where.status = status;
    if (roomTypeId) where.roomTypeId = roomTypeId;

    return super.getAll({
      where,
      include: [
        {
          model: RoomType,
          as: 'roomType',
          attributes: ['id', 'name', 'description', 'basePrice', 'maxCapacity'],
        },
      ],
      order: [
        ['floor', 'ASC'],
        ['roomNumber', 'ASC'],
      ],
    });
  }
}

export default new RoomService();
