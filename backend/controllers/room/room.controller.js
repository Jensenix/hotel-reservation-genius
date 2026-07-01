import BaseController from '#controllers/base/base.controller.js';
import roomService from '#services/room/room.service.js';
import { publish, CHANNELS } from '#services/websocket/eventPublisher.js';
import { RealtimeEvents } from '#shared/eventContract.js';

class RoomController extends BaseController {
  /**
   * Creates one or more physical rooms.
   */
  createRoom = this.asyncHandler(async (req, res) => {
    const data = await roomService.createRoom(req.body);
    this.sendCreated(res, 'Room created successfully', Array.isArray(data) ? data : [data]);
  });

  /**
   * Retrieves all rooms, either as a simple list or paginated depending on service implementation.
   */
  getAllRooms = this.asyncHandler(async (req, res) => {
    const data = await roomService.getAllRooms(req.query);
    if (Array.isArray(data)) {
      this.sendSuccess(res, 'Rooms retrieved successfully', data);
    } else {
      this.sendPaginated(res, 'Rooms retrieved successfully', data.rows, data.pagination);
    }
  });

  /**
   * Retrieves a specific room by ID.
   */
  getRoomById = this.asyncHandler(async (req, res) => {
    const data = await roomService.getRoomById(req.params.id);
    this.sendSuccess(res, 'Room retrieved successfully', Array.isArray(data) ? data : [data]);
  });

  /**
   * Updates room details.
   */
  updateRoom = this.asyncHandler(async (req, res) => {
    const data = await roomService.updateRoom(req.params.id, req.body);
    this.sendSuccess(res, 'Room updated successfully', data);
  });

  /**
   * Deletes a room.
   */
  deleteRoom = this.asyncHandler(async (req, res) => {
    await roomService.deleteRoom(req.params.id);
    this.sendSuccess(res, 'Room deleted successfully');
  });

  /**
   * Retrieves rooms including their RoomType information.
   */
  getAllWithRoomType = this.asyncHandler(async (req, res) => {
    const data = await roomService.getAllWithRoomType(req.query);
    this.sendSuccess(res, 'Rooms with room type retrieved successfully', data);
  });

  /**
   * Updates a physical room's status and broadcasts the change via WebSocket.
   */
  updateRoomStatus = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const updatedRoom = await roomService.updateRoom(id, { status });

    publish(CHANNELS.ROOM, {
      event: RealtimeEvents.ROOM.STATUS_CHANGED,
      data: {
        roomId: id,
        status,
      },
      rooms: ['admin:dashboard', 'room:public_availability'] 
    });

    this.sendSuccess(res, `Room status successfully updated to ${status}`, updatedRoom);
  });
}

export default new RoomController();