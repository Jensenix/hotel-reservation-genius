const { ExtraService } = require('../models');

class ExtraServiceController {
  /**
   * Creates a new extra service.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the created extra service.
   */
  async createExtraService(req, res) {
    try {
      const { serviceName, price } = req.body;

      if (!serviceName || !price) {
        return res.status(400).json({
          success: false,
          message: 'serviceName and price are required'
        });
      }

      const extraService = await ExtraService.create({
        serviceName,
        price
      });

      return res.status(201).json({
        success: true,
        message: 'Extra service created successfully',
        data: extraService
      });
    } catch (error) {
      console.error('Error creating extra service:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating extra service',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all available extra services.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing a list of extra services.
   */
  async getAllExtraServices(req, res) {
    try {
      const extraServices = await ExtraService.findAll({
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Extra services retrieved successfully',
        data: extraServices
      });
    } catch (error) {
      console.error('Error getting extra services:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting extra services',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific extra service by ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the extra service data.
   */
  async getExtraServiceById(req, res) {
    try {
      const { id } = req.params;

      const extraService = await ExtraService.findByPk(id);

      if (!extraService) {
        return res.status(404).json({
          success: false,
          message: 'Extra service not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Extra service retrieved successfully',
        data: extraService
      });
    } catch (error) {
      console.error('Error getting extra service:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting extra service',
        error: error.message
      });
    }
  }

  /**
   * Updates an existing extra service.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated extra service.
   */
  async updateExtraService(req, res) {
    try {
      const { id } = req.params;
      const { serviceName, price } = req.body;

      const extraService = await ExtraService.findByPk(id);

      if (!extraService) {
        return res.status(404).json({
          success: false,
          message: 'Extra service not found'
        });
      }

      await extraService.update({
        serviceName: serviceName || extraService.serviceName,
        price: price || extraService.price
      });

      return res.status(200).json({
        success: true,
        message: 'Extra service updated successfully',
        data: extraService
      });
    } catch (error) {
      console.error('Error updating extra service:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating extra service',
        error: error.message
      });
    }
  }

  /**
   * Deletes an extra service.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
  async deleteExtraService(req, res) {
    try {
      const { id } = req.params;

      const extraService = await ExtraService.findByPk(id);

      if (!extraService) {
        return res.status(404).json({
          success: false,
          message: 'Extra service not found'
        });
      }

      await extraService.destroy();

      return res.status(200).json({
        success: true,
        message: 'Extra service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting extra service:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting extra service',
        error: error.message
      });
    }
  }
}

module.exports = new ExtraServiceController();