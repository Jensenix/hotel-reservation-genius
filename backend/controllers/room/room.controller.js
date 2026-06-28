import roomService from '#services/room/room.service.js';
import BaseController from '../base/base.controller.js';
import { sendResponse } from '#utils/responseHandler.js';

class RoomController extends BaseController {
  constructor() {
    super(roomService, 'Room');
  }

  createRoom = this.create;
  getAllRooms = this.getAll;
  getRoomById = this.getById;
  updateRoom = this.update;
  deleteRoom = this.delete;

  getAllWithRoomType = async (req, res, next) => {
    try {
      const data = await this.service.getAllWithRoomType(req.query);
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;
      
      return sendResponse(res, 200, 'Rooms with room type retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomController();