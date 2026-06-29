import db from '#models/index.js';
const { Room, RoomType, Booking } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/base.service.js';
import { publish, CHANNELS } from '../websocket/eventPublisher.js';

class RoomService extends BaseService {
  constructor() {
    super(Room, 'Room');
  }

  /**
   * Creates a new room.
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

    const updatedRoom = await room.update(data);

    if (data.status) {
      try {
        const payload = { roomId: updatedRoom.id, status: updatedRoom.status };
        await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: payload, room: `room:${updatedRoom.id}` });
        await publish(CHANNELS.ROOM, { event: 'room_availability_changed', data: payload, room: 'admin:dashboard' });
      } catch (err) {
        console.error('[RoomService] Failed to publish room_availability_changed event:', err.message);
      }
    }

    return updatedRoom;
  }

  /**
   * Deletes a room by its ID.
   */
  async deleteRoom(id) {
    return super.delete(id);
  }

  /**
   * Retrieves all rooms, including their associated room type data.
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