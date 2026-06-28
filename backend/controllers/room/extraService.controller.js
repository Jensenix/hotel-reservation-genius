import BaseController from '#controllers/base/base.controller.js';
import ExtraServiceService from '#services/room/extraService.service.js';

class ExtraServiceController extends BaseController {
  createExtraService = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.createExtraService(req.body);
    this.sendCreated(res, 'Extra service created successfully', data);
  });

  getAllExtraServices = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.getAll();
    this.sendSuccess(res, 'Extra services retrieved successfully', data);
  });

  getExtraServiceById = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.getExtraServiceById(req.params.id);
    this.sendSuccess(res, 'Extra service retrieved successfully', data);
  });

  updateExtraService = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.updateExtraService(req.params.id, req.body);
    this.sendSuccess(res, 'Extra service updated successfully', data);
  });

  deleteExtraService = this.asyncHandler(async (req, res) => {
    await ExtraServiceService.deleteExtraService(req.params.id);
    this.sendSuccess(res, 'Extra service deleted successfully');
  });
}

export default new ExtraServiceController();