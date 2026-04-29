const extraServiceService = require('../services/extraServiceService');

class ExtraServiceController {
  async createExtraService(req, res) {
    try {
      const data = await extraServiceService.createExtraService(req.body);
      res.status(201).json({ success: true, message: 'Extra service created successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  async getAllExtraServices(req, res) {
    try {
      const data = await extraServiceService.getAllExtraServices();
      res.status(200).json({ success: true, message: 'Extra services retrieved successfully', data });
    } catch (error) { res.status(500).json({ success: false, message: 'Error getting extra services', error: error.message }); }
  }

  async getExtraServiceById(req, res) {
    try {
      const data = await extraServiceService.getExtraServiceById(req.params.id);
      res.status(200).json({ success: true, message: 'Extra service retrieved successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  async updateExtraService(req, res) {
    try {
      const data = await extraServiceService.updateExtraService(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Extra service updated successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  async deleteExtraService(req, res) {
    try {
      await extraServiceService.deleteExtraService(req.params.id);
      res.status(200).json({ success: true, message: 'Extra service deleted successfully' });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }
}

module.exports = new ExtraServiceController();