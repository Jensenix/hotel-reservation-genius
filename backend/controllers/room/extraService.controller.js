import BaseController from '#controllers/base/base.controller.js';
import ExtraServiceService from '#services/room/extraService.service.js';

class ExtraServiceController extends BaseController {
  /**
   * Creates a new extra service definition.
   */
  createExtraService = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.createExtraService(req.body);
    this.sendCreated(res, 'Extra service created successfully', data);
  });

  /**
   * Retrieves all available extra services.
   */
  getAllExtraServices = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.getAll();
    this.sendSuccess(res, 'Extra services retrieved successfully', data);
  });

  /**
   * Retrieves an extra service by ID.
   */
  getExtraServiceById = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.getExtraServiceById(req.params.id);
    this.sendSuccess(res, 'Extra service retrieved successfully', data);
  });

  /**
   * Updates an existing extra service definition.
   */
  updateExtraService = this.asyncHandler(async (req, res) => {
    const data = await ExtraServiceService.updateExtraService(req.params.id, req.body);
    this.sendSuccess(res, 'Extra service updated successfully', data);
  });

  /**
   * Deletes an extra service.
   */
  deleteExtraService = this.asyncHandler(async (req, res) => {
    await ExtraServiceService.deleteExtraService(req.params.id);
    this.sendSuccess(res, 'Extra service deleted successfully');
  });
}

export default new ExtraServiceController();