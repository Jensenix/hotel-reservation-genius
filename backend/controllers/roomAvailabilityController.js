const roomAvailabilityService = require('../services/roomAvailabilityService');

class RoomAvailabilityController {
  async getRoomAvailability(req, res) {
    try {
      const data = await roomAvailabilityService.getRoomAvailability(req.query.date);
      res.json({ success: true, message: 'Room availability data retrieved successfully', data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching room availability data', error: error.message });
    }
  }

  async getRoomTypeAvailability(req, res) {
    try {
      const data = await roomAvailabilityService.getRoomTypeAvailability(req.params.roomTypeId, req.query.date);
      res.json({ success: true, message: 'Room type availability data retrieved successfully', data });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error fetching room type availability data' });
    }
  }
}

module.exports = new RoomAvailabilityController();