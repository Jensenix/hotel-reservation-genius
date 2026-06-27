import roomAvailabilityService from '../services/roomAvailabilityService.js';

class RoomAvailabilityController {
  getRoomAvailability = async (req, res) => {
    try {
      const data = await roomAvailabilityService.getRoomAvailability(
        req.query.date,
      );
      res.json({
        success: true,
        message: 'Room availability data retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching room availability data',
        error: error.message,
      });
    }
  }

  getRoomTypeAvailability = async (req, res) => {
    try {
      const data = await roomAvailabilityService.getRoomTypeAvailability(
        req.params.roomTypeId,
        req.query.date,
      );
      res.json({
        success: true,
        message: 'Room type availability data retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error fetching room type availability data',
      });
    }
  }
}

export default new RoomAvailabilityController();
