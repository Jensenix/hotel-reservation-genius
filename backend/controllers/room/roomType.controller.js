import BaseController from '#controllers/base/base.controller.js';
import roomTypeService from '#services/room/roomType.service.js';

class RoomTypeController extends BaseController {
  /**
   * Creates a new room type.
   */
  createRoomType = this.asyncHandler(async (req, res) => {
    const data = await roomTypeService.createRoomType(req.body);
    this.sendCreated(res, 'Room type created successfully', data);
  });

  /**
   * Retrieves all room types.
   */
  getAllRoomTypes = this.asyncHandler(async (req, res) => {
    const data = await roomTypeService.getAllRoomTypes(req.query);
    this.sendSuccess(res, 'Room types retrieved successfully', data);
  });

  /**
   * Retrieves room types along with their linked facilities.
   */
  getAllRoomTypesWithFacilities = this.asyncHandler(async (req, res) => {
    const data = await roomTypeService.getAllRoomTypesWithFacilities();
    this.sendSuccess(res, 'Room types with facilities retrieved successfully', data);
  });

  /**
   * Retrieves a specific room type by ID.
   */
  getRoomTypeById = this.asyncHandler(async (req, res) => {
    const data = await roomTypeService.getRoomTypeById(req.params.id);
    this.sendSuccess(res, 'Room type retrieved successfully', data);
  });

  /**
   * Updates a room type.
   */
  updateRoomType = this.asyncHandler(async (req, res) => {
    const data = await roomTypeService.updateRoomType(req.params.id, req.body);
    this.sendSuccess(res, 'Room type updated successfully', data);
  });

  /**
   * Deletes a room type.
   */
  deleteRoomType = this.asyncHandler(async (req, res) => {
    await roomTypeService.deleteRoomType(req.params.id);
    this.sendSuccess(res, 'Room type deleted successfully');
  });
}

export default new RoomTypeController();