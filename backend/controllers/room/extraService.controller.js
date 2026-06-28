import ExtraServiceService from '#services/room/extraService.service.js';
import BaseController from '../base/base.controller.js';

class ExtraServiceController extends BaseController {
  constructor() {
    super(ExtraServiceService, 'Extra service');
  }

  createExtraService = this.create;
  getAllExtraServices = this.getAll;
  getExtraServiceById = this.getById;
  updateExtraService = this.update;
  deleteExtraService = this.delete;
}

export default new ExtraServiceController();