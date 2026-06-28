import roomTypeService from '#services/room/roomType.service.js';
import BaseController from '../base/base.controller.js';
import { sendResponse } from '#utils/responseHandler.js';

class RoomTypeController extends BaseController {
  constructor() {
    super(roomTypeService, 'Room type');
  }

  createRoomType = this.create;
  getAllRoomTypes = this.getAll;
  getRoomTypeById = this.getById;
  updateRoomType = this.update;
  deleteRoomType = this.delete;

  getAllRoomTypesWithFacilities = async (req, res, next) => {
    try {
      const data = await this.service.getAllRoomTypesWithFacilities();
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      
      return sendResponse(res, 200, 'Room types with facilities retrieved successfully', records);
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomTypeController();