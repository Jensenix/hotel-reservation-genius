import BaseController from '#controllers/base/base.controller.js';
import facilityService from '#services/room/facility.service.js';

class FacilityController extends BaseController {
  createFacility = this.asyncHandler(async (req, res) => {
    const data = await facilityService.createFacility(req.body);
    this.sendCreated(res, 'Facility created successfully', data);
  });

  getAllFacilities = this.asyncHandler(async (req, res) => {
    const data = await facilityService.getAll();
    this.sendSuccess(res, 'Facilities retrieved successfully', data);
  });

  getFacilityById = this.asyncHandler(async (req, res) => {
    const data = await facilityService.getFacilityById(req.params.id);
    this.sendSuccess(res, 'Facility retrieved successfully', data);
  });

  updateFacility = this.asyncHandler(async (req, res) => {
    const data = await facilityService.updateFacility(req.params.id, req.body);
    this.sendSuccess(res, 'Facility updated successfully', data);
  });

  deleteFacility = this.asyncHandler(async (req, res) => {
    await facilityService.deleteFacility(req.params.id);
    this.sendSuccess(res, 'Facility deleted successfully');
  });
}

export default new FacilityController();