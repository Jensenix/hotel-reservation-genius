import roomAvailabilityService from '#services/room/roomAvailability.service.js';
import { sendResponse } from '#utils/responseHandler.js';

class RoomAvailabilityController {
  getRoomAvailability = async (req, res, next) => {
    try {
      const data = await roomAvailabilityService.getRoomAvailability(req.query.date);
      return sendResponse(res, 200, 'Room availability data retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  getRoomTypeAvailability = async (req, res, next) => {
    try {
      const data = await roomAvailabilityService.getRoomTypeAvailability(req.params.roomTypeId, req.query.date);
      return sendResponse(res, 200, 'Room type availability data retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomAvailabilityController();