const { RoomType, Room, Facility } = require('../models');

class RoomTypeController {
  // Create new room type
  async createRoomType(req, res) {
    try {
      const { name, description, basePrice, maxCapacity } = req.body;

      // Manual validation
      if (!name || !basePrice || !maxCapacity) {
        return res.status(400).json({
          success: false,
          message: 'name, basePrice, and maxCapacity are required'
        });
      }

      const roomType = await RoomType.create({
        name,
        description,
        basePrice,
        maxCapacity
      });

      return res.status(201).json({
        success: true,
        message: 'Room type created successfully',
        data: roomType
      });
    } catch (error) {
      console.error('Error creating room type:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating room type',
        error: error.message
      });
    }
  }

  // Get all room types with filtering
  async getAllRoomTypes(req, res) {
    try {
      const { minPrice, maxPrice, search } = req.query;

      const where = {};

      // Filter by price range
      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice[require('sequelize').Op.gte] = minPrice;
        if (maxPrice) where.basePrice[require('sequelize').Op.lte] = maxPrice;
      }

      // Search by name
      if (search) {
        where.name = { [require('sequelize').Op.like]: `%${search}%` };
      }

      const roomTypes = await RoomType.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Facility,
            as: 'facilities'
          },
          {
            model: Room,
            as: 'rooms'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Room types retrieved successfully',
        data: roomTypes
      });
    } catch (error) {
      console.error('Error getting room types:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting room types',
        error: error.message
      });
    }
  }

  // Get room type by ID
  async getRoomTypeById(req, res) {
    try {
      const { id } = req.params;

      const roomType = await RoomType.findByPk(id, {
        include: [
          {
            model: Facility,
            as: 'facilities'
          },
          {
            model: Room,
            as: 'rooms'
          }
        ]
      });

      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Room type retrieved successfully',
        data: roomType
      });
    } catch (error) {
      console.error('Error getting room type:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting room type',
        error: error.message
      });
    }
  }

  // Update room type
  async updateRoomType(req, res) {
    try {
      const { id } = req.params;
      const { name, description, basePrice, maxCapacity } = req.body;

      const roomType = await RoomType.findByPk(id);

      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }

      await roomType.update({
        name: name || roomType.name,
        description: description || roomType.description,
        basePrice: basePrice || roomType.basePrice,
        maxCapacity: maxCapacity || roomType.maxCapacity
      });

      return res.status(200).json({
        success: true,
        message: 'Room type updated successfully',
        data: roomType
      });
    } catch (error) {
      console.error('Error updating room type:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating room type',
        error: error.message
      });
    }
  }

  // Delete room type
  async deleteRoomType(req, res) {
    try {
      const { id } = req.params;

      const roomType = await RoomType.findByPk(id);

      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }

      await roomType.destroy();

      return res.status(200).json({
        success: true,
        message: 'Room type deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting room type:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting room type',
        error: error.message
      });
    }
  }
}

module.exports = new RoomTypeController();
