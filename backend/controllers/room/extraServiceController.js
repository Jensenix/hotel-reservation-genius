import ExtraServiceService from '../../services/room/extraServiceService.js';

class ExtraServiceController {
  createExtraService = async (req, res) => {
    try {
      const data = await ExtraServiceService.createExtraService(req.body);
      res.status(201).json({ success: true, message: 'Extra service created successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  getAllExtraServices = async (req, res) => {
    try {
      const data = await ExtraServiceService.getAll();
      res.status(200).json({ success: true, message: 'Extra services retrieved successfully', data });
    } catch (error) { res.status(500).json({ success: false, message: 'Error getting extra services', error: error.message }); }
  }

  getExtraServiceById = async (req, res) => {
    try {
      const data = await ExtraServiceService.getExtraServiceById(req.params.id);
      res.status(200).json({ success: true, message: 'Extra service retrieved successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  updateExtraService = async (req, res) => {
    try {
      const data = await ExtraServiceService.updateExtraService(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Extra service updated successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  deleteExtraService = async (req, res) => {
    try {
      await ExtraServiceService.deleteExtraService(req.params.id);
      res.status(200).json({ success: true, message: 'Extra service deleted successfully' });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }
}

export default new ExtraServiceController();