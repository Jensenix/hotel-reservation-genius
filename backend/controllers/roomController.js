const { Room, RoomType, Booking } = require('../models');
const pagination = require('../utils/pagination');

class RoomController {
  // Create new room
  async createRoom(req, res) {
    try {
      const { roomNumber, roomTypeId, floor, status } = req.body;

      // Manual validation
      if (!roomNumber || !roomTypeId) {
        return res.status(400).json({
          success: false,
          message: 'roomNumber and roomTypeId are required'
        });
      }

      // Check if room number already exists
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

  // Get all rooms with pagination and filtering
  async getAllRooms(req, res) {
    try {
      const { page = 1, limit = 10, status, roomTypeId, floor } = req.query;

      const where = {};

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Filter by room type
      if (roomTypeId) {
        where.roomTypeId = roomTypeId;
      }

      // Filter by floor
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
        pagination: pagination.getPagingData(count, page, parsedLimit)
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

  // Get room by ID
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

  // Update room
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

      // Check if room number already exists (if room number is being changed)
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

  // Delete room
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
}

module.exports = new RoomController();
