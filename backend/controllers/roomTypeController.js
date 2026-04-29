const { RoomType, Room, Facility } = require('../models');

class RoomTypeController {
  /**
   * Creates a new room type.
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body containing room type details.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the newly created room type.
   */
  async createRoomType(req, res) {
    try {
      const { name, description, basePrice, maxCapacity } = req.body;

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

  /**
   * Retrieves all room types with optional filtering for price and search terms.
   * @param {Object} req - The Express request object.
   * @param {Object} req.query - The query parameters.
   * @param {number} [req.query.minPrice] - Minimum base price filter.
   * @param {number} [req.query.maxPrice] - Maximum base price filter.
   * @param {string} [req.query.search] - Search term for room type names.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the list of matching room types.
   */
  async getAllRoomTypes(req, res) {
    try {
      const { minPrice, maxPrice, search } = req.query;

      const where = {};

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice[require('sequelize').Op.gte] = minPrice;
        if (maxPrice) where.basePrice[require('sequelize').Op.lte] = maxPrice;
      }

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

  /**
   * Retrieves all room types along with their associated facilities.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with room types and facilities.
   */
  async getAllRoomTypesWithFacilities(req, res) {
    try {
      const roomTypes = await RoomType.findAll({
        include: [{
          model: Facility,
          as: 'facilities',
          through: { attributes: [] } 
        }],
        order: [['basePrice', 'ASC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Room types with facilities retrieved successfully',
        data: roomTypes
      });
    } catch (error) {
      console.error('Error getting room types with facilities:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting room types with facilities',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific room type by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room type.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the room type details.
   */
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

  /**
   * Updates an existing room type.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room type.
   * @param {Object} req.body - The room type attributes to update.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated room type.
   */
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

  /**
   * Deletes a room type by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the room type.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming the deletion.
   */
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