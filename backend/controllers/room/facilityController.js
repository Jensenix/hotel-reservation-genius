import facilityService from '../../services/room/facilityService.js';

class FacilityController {
  createFacility = async (req, res) => {
    try {
      const data = await facilityService.createFacility(req.body);
      res.status(201).json({ success: true, message: 'Facility created successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  getAllFacilities = async (req, res) => {
    try {
      const data = await facilityService.getAll();
      res.status(200).json({ success: true, message: 'Facilities retrieved successfully', data });
    } catch (error) { res.status(500).json({ success: false, message: 'Error getting facilities', error: error.message }); }
  }

  getFacilityById = async (req, res) => {
    try {
      const data = await facilityService.getFacilityById(req.params.id);
      res.status(200).json({ success: true, message: 'Facility retrieved successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  updateFacility = async (req, res) => {
    try {
      const data = await facilityService.updateFacility(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Facility updated successfully', data });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }

  deleteFacility = async (req, res) => {
    try {
      await facilityService.deleteFacility(req.params.id);
      res.status(200).json({ success: true, message: 'Facility deleted successfully' });
    } catch (error) { res.status(error.statusCode || 500).json({ success: false, message: error.message }); }
  }
}
export default new FacilityController();