import BaseController from '#controllers/base/base.controller.js';
import roomService from '#services/room/room.service.js';

class RoomController extends BaseController {
  createRoom = this.asyncHandler(async (req, res) => {
    const data = await roomService.createRoom(req.body);
    this.sendCreated(res, 'Room created successfully', Array.isArray(data) ? data : [data]);
  });

  getAllRooms = this.asyncHandler(async (req, res) => {
    const data = await roomService.getAllRooms(req.query);
    if (Array.isArray(data)) {
      this.sendSuccess(res, 'Rooms retrieved successfully', data);
    } else {
      this.sendPaginated(res, 'Rooms retrieved successfully', data.rows, data.pagination);
    }
  });

  getRoomById = this.asyncHandler(async (req, res) => {
    const data = await roomService.getRoomById(req.params.id);
    this.sendSuccess(res, 'Room retrieved successfully', Array.isArray(data) ? data : [data]);
  });

  updateRoom = this.asyncHandler(async (req, res) => {
    const data = await roomService.updateRoom(req.params.id, req.body);
    this.sendSuccess(res, 'Room updated successfully', data);
  });

  deleteRoom = this.asyncHandler(async (req, res) => {
    await roomService.deleteRoom(req.params.id);
    this.sendSuccess(res, 'Room deleted successfully');
  });

  getAllWithRoomType = this.asyncHandler(async (req, res) => {
    const data = await roomService.getAllWithRoomType(req.query);
    this.sendSuccess(res, 'Rooms with room type retrieved successfully', data);
  });
}

export default new RoomController();