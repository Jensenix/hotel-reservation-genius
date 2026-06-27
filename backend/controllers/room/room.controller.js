import roomService from '#services/room/room.service.js';

class RoomController {
  createRoom = async (req, res) => {
    try {
      const data = await roomService.createRoom(req.body);
      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: Array.isArray(data) ? data : [data],
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllRooms = async (req, res) => {
    try {
      const data = await roomService.getAllRooms(req.query);
      // Jika data adalah array (no pagination), kirim langsung
      if (Array.isArray(data)) {
        res.status(200).json({
          success: true,
          message: 'Rooms retrieved successfully',
          data,
        });
      } else {
        // Jika data adalah object (dengan pagination), kirim dengan pagination
        res.status(200).json({
          success: true,
          message: 'Rooms retrieved successfully',
          data: data.rows,
          pagination: data.pagination,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting rooms',
        error: error.message,
      });
    }
  };

  getRoomById = async (req, res) => {
    try {
      const data = await roomService.getRoomById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Room retrieved successfully',
        data: Array.isArray(data) ? data : [data],
      });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  updateRoom = async (req, res) => {
    try {
      const data = await roomService.updateRoom(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: 'Room updated successfully', data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  deleteRoom = async (req, res) => {
    try {
      await roomService.deleteRoom(req.params.id);
      res
        .status(200)
        .json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message });
    }
  };

  getAllWithRoomType = async (req, res) => {
    try {
      const data = await roomService.getAllWithRoomType(req.query);
      res.status(200).json({
        success: true,
        message: 'Rooms with room type retrieved successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting rooms with room type',
        error: error.message,
      });
    }
  };
}

export default new RoomController();
