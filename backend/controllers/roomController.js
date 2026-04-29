const { Room, RoomType, Booking } = require('../models');
const pagination = require('../utils/pagination');

class RoomController {
  /**
   * Creates a new room.
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.roomNumber - The room number.
   * @param {string|number} req.body.roomTypeId - The ID of the associated room type.
   * @param {number} req.body.floor - The floor number.
   * @param {string} [req.body.status] - The initial status of the room.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the created room data.
   */
  async createRoom(req, res) {
    try {
      const { roomNumber, roomTypeId, floor, status } = req.body;

      if (!roomNumber || !roomTypeId) {
        return res.status(400).json({
          success: false,
          message: 'roomNumber and roomTypeId are required'
        });
      }

      const existingRoom = await Room.findOne({ where: { roomNumber } });
      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: 'Room number already exists'
        });
      }

      const room = await Room.create({
        roomNumber,
        roomTypeId,
        floor,
        status: status || 'available'
      });

      return res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room
      });
    } catch (error) {
      console.error('Error creating room:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating room',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all rooms with optional pagination and filtering.
   * @param {Object} req - The Express request object.
   * @param {Object} req.query - The query parameters.
   * @param {number} [req.query.page] - The page number for pagination.
   * @param {number} [req.query.limit] - The number of items per page.
   * @param {string} [req.query.status] - The status to filter by.
   * @param {string|number} [req.query.roomTypeId] - The room type ID to filter by.
   * @param {number} [req.query.floor] - The floor to filter by.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing a paginated list of rooms.
   */
  async getAllRooms(req, res) {
    try {
      const { page = 1, limit, status, roomTypeId, floor } = req.query;

      const where = {};

      if (status) {
        where.status = status;
      }

      if (roomTypeId) {
        where.roomTypeId = roomTypeId;
      }

      if (floor) {
        where.floor = floor;
      }

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await Room.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: RoomType,
            as: 'roomType'
          },
          {
            model: Booking,
            as: 'bookings'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Rooms retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit)
      });
    } catch (error) {
      console.error('Error getting rooms:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting rooms',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific room by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the room data.
   */
  async getRoomById(req, res) {
    try {
      const { id } = req.params;

      const room = await Room.findByPk(id, {
        include: [
          {
            model: RoomType,
            as: 'roomType'
          },
          {
            model: Booking,
            as: 'bookings'
          }
        ]
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Room retrieved successfully',
        data: room
      });
    } catch (error) {
      console.error('Error getting room:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting room',
        error: error.message
      });
    }
  }

  /**
   * Updates an existing room's details.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room.
   * @param {Object} req.body - The data to update.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the updated room data.
   */
  async updateRoom(req, res) {
    try {
      const { id } = req.params;
      const { roomNumber, roomTypeId, floor, status } = req.body;

      const room = await Room.findByPk(id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      if (roomNumber && roomNumber !== room.roomNumber) {
        const existingRoom = await Room.findOne({ where: { roomNumber } });
        if (existingRoom) {
          return res.status(400).json({
            success: false,
            message: 'Room number already exists'
          });
        }
      }

      await room.update({
        roomNumber: roomNumber || room.roomNumber,
        roomTypeId: roomTypeId || room.roomTypeId,
        floor: floor || room.floor,
        status: status || room.status
      });

      return res.status(200).json({
        success: true,
        message: 'Room updated successfully',
        data: room
      });
    } catch (error) {
      console.error('Error updating room:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating room',
        error: error.message
      });
    }
  }

  /**
   * Deletes a room by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming the deletion.
   */
  async deleteRoom(req, res) {
    try {
      const { id } = req.params;

      const room = await Room.findByPk(id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      await room.destroy();

      return res.status(200).json({
        success: true,
        message: 'Room deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting room',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all rooms, including their associated room type data.
   * @param {Object} req - The Express request object.
   * @param {Object} req.query - The query parameters.
   * @param {string} [req.query.status] - Optional status filter.
   * @param {string|number} [req.query.roomTypeId] - Optional room type ID filter.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing rooms with their room type info.
   */
  async getAllWithRoomType(req, res) {
    try {
      const { status, roomTypeId } = req.query;

      const where = {};
      if (status) {
        where.status = status;
      }
      if (roomTypeId) {
        where.roomTypeId = roomTypeId;
      }

      const rooms = await Room.findAll({
        where,
        include: [
          {
            model: RoomType,
            as: 'roomType',
            attributes: ['id', 'name', 'description', 'basePrice', 'maxCapacity']
          }
        ],
        order: [['floor', 'ASC'], ['roomNumber', 'ASC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Rooms with room type retrieved successfully',
        data: rooms
      });
    } catch (error) {
      console.error('Error getting rooms with room type:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting rooms with room type',
        error: error.message
      });
    }
  }
}

module.exports = new RoomController();