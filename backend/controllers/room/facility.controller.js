import BaseController from '#controllers/base/base.controller.js';
import facilityService from '#services/room/facility.service.js';

class FacilityController extends BaseController {
  /**
   * Creates a new facility entry.
   */
  createFacility = this.asyncHandler(async (req, res) => {
    const data = await facilityService.createFacility(req.body);
    this.sendCreated(res, 'Facility created successfully', data);
  });

  /**
   * Retrieves all facilities.
   */
  getAllFacilities = this.asyncHandler(async (req, res) => {
    const data = await facilityService.getAll();
    this.sendSuccess(res, 'Facilities retrieved successfully', data);
  });

  /**
   * Retrieves a facility by ID.
   */
  getFacilityById = this.asyncHandler(async (req, res) => {
    const data = await facilityService.getFacilityById(req.params.id);
    this.sendSuccess(res, 'Facility retrieved successfully', data);
  });

  /**
   * Updates a facility.
   */
  updateFacility = this.asyncHandler(async (req, res) => {
    const data = await facilityService.updateFacility(req.params.id, req.body);
    this.sendSuccess(res, 'Facility updated successfully', data);
  });

  /**
   * Deletes a facility.
   */
  deleteFacility = this.asyncHandler(async (req, res) => {
    await facilityService.deleteFacility(req.params.id);
    this.sendSuccess(res, 'Facility deleted successfully');
  });
}

export default new FacilityController();