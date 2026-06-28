import BaseController from '#controllers/base/base.controller.js';
import roomAvailabilityService from '#services/room/roomAvailability.service.js';

class RoomAvailabilityController extends BaseController {
  getRoomAvailability = this.asyncHandler(async (req, res) => {
    const data = await roomAvailabilityService.getRoomAvailability(req.query.date);
    this.sendSuccess(res, 'Room availability data retrieved successfully', data);
  });

  getRoomTypeAvailability = this.asyncHandler(async (req, res) => {
    const data = await roomAvailabilityService.getRoomTypeAvailability(
      req.params.roomTypeId,
      req.query.date,
    );
    this.sendSuccess(res, 'Room type availability data retrieved successfully', data);
  });
}

export default new RoomAvailabilityController();