import facilityService from '#services/room/facility.service.js';
import BaseController from '../base/base.controller.js';

class FacilityController extends BaseController {
  constructor() {
    super(facilityService, 'Facility');
  }

  createFacility = this.create;
  getAllFacilities = this.getAll;
  getFacilityById = this.getById;
  updateFacility = this.update;
  deleteFacility = this.delete;
}

export default new FacilityController();