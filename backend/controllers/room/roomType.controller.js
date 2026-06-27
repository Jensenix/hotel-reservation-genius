import roomTypeService from '#services/room/roomType.service.js';

class RoomTypeController {
  createRoomType = async (req, res) => {
    try {
      const data = await roomTypeService.createRoomType(req.body);
      res.status(201).json({
        success: true,
        message: 'Room type created successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllRoomTypes = async (req, res) => {
    try {
      const data = await roomTypeService.getAllRoomTypes(req.query);
      res.status(200).json({
        success: true,
        message: 'Room types retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting room types',
        error: error.message,
      });
    }
  };

  getAllRoomTypesWithFacilities = async (req, res) => {
    try {
      const data = await roomTypeService.getAllRoomTypesWithFacilities();
      res.status(200).json({
        success: true,
        message: 'Room types with facilities retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting room types with facilities',
        error: error.message,
      });
    }
  };

  getRoomTypeById = async (req, res) => {
    try {
      const data = await roomTypeService.getRoomTypeById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Room type retrieved successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  updateRoomType = async (req, res) => {
    try {
      const data = await roomTypeService.updateRoomType(
        req.params.id,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: 'Room type updated successfully',
        data,
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  deleteRoomType = async (req, res) => {
    try {
      await roomTypeService.deleteRoomType(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'Room type deleted successfully' });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };
}

export default new RoomTypeController();
