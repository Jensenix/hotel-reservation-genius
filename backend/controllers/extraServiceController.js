const { ExtraService } = require('../models');

class ExtraServiceController {
  // Create new extra service
  async createExtraService(req, res) {
    try {
      const { serviceName, price } = req.body;

      // Manual validation
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

  // Get all extra services
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

  // Get extra service by ID
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

  // Update extra service
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

  // Delete extra service
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
