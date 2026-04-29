const { Room, RoomType, Booking } = require('../models');

class RoomAvailabilityController {
  /**
   * Retrieves room availability statistics overall and by room type for a given date.
   * @param {Object} req - The Express request object.
   * @param {Object} req.query - The query parameters.
   * @param {string} [req.query.date] - The target date to check availability. Defaults to today.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with overall and per-room-type availability statistics.
   */
  static async getRoomAvailability(req, res) {
    try {
      const { date } = req.query;
      
      const Op = require('sequelize').Op;
      
      const targetDate = date ? new Date(date) : new Date();
      
      const targetDateStart = new Date(targetDate);
      targetDateStart.setHours(0, 0, 0, 0);
      
      const targetDateEnd = new Date(targetDate);
      targetDateEnd.setHours(23, 59, 59, 999);

      const roomTypes = await RoomType.findAll({
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: ['id', 'roomNumber', 'status', 'floor']
          }
        ],
        order: [['basePrice', 'ASC']]
      });

      const availabilityData = await Promise.all(roomTypes.map(async (roomType) => {
        const totalPhysicalRooms = roomType.rooms.length;
        
        const bookings = await Booking.findAll({
          include: [
            {
              model: Room,
              as: 'room',
              where: {
                roomTypeId: roomType.id
              },
              attributes: ['id', 'roomNumber', 'status']
            }
          ],
          where: {
            status: { [Op.ne]: 'cancelled' },
            checkInDate: { [Op.lte]: targetDate },
            checkOutDate: { [Op.gt]: targetDate }
          }
        });

        const bookedRoomIds = bookings.map(b => b.roomId);
        
        const maintenanceRooms = roomType.rooms.filter(r => r.status === 'maintenance').length;
        const cleaningRooms = roomType.rooms.filter(r => r.status === 'cleaning').length;
        
        const availableRooms = roomType.rooms.filter(
          room => !bookedRoomIds.includes(room.id) && 
                   room.status === 'available'
        ).length;
        
        const occupiedRooms = roomType.rooms.filter(
          room => bookedRoomIds.includes(room.id) || room.status === 'occupied'
        ).length;

        const availabilityPercentage = totalPhysicalRooms > 0 
          ? Math.round((availableRooms / totalPhysicalRooms) * 100) 
          : 0;

        const rooms = roomType.rooms.map(room => {
          const isBooked = bookedRoomIds.includes(room.id);
          let status = room.status;
          
          if (isBooked) {
            status = 'occupied';
          } else if (room.status === 'maintenance' || room.status === 'cleaning') {
            status = room.status;
          } else {
            status = 'available';
          }
          
          return {
            id: room.id,
            roomNumber: room.roomNumber,
            status: status,
            floor: room.floor,
            isBooked: isBooked
          };
        });

        return {
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          basePrice: roomType.basePrice,
          maxCapacity: roomType.maxCapacity,
          totalRooms: totalPhysicalRooms,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          cleaningRooms,
          availabilityPercentage,
          bookedRoomsCount: bookedRoomIds.length,
          rooms
        };
      }));

      const overall = {
        totalRooms: roomTypes.reduce((sum, rt) => sum + rt.rooms.length, 0),
        availableRooms: availabilityData.reduce((sum, rt) => sum + rt.availableRooms, 0),
        occupiedRooms: availabilityData.reduce((sum, rt) => sum + rt.occupiedRooms, 0),
        maintenanceRooms: availabilityData.reduce((sum, rt) => sum + rt.maintenanceRooms, 0),
        cleaningRooms: availabilityData.reduce((sum, rt) => sum + rt.cleaningRooms, 0)
      };

      overall.availabilityRate = overall.totalRooms > 0 
        ? Math.round((overall.availableRooms / overall.totalRooms) * 100) 
        : 0;
      overall.occupancyRate = overall.totalRooms > 0 
        ? Math.round((overall.occupiedRooms / overall.totalRooms) * 100) 
        : 0;

      res.json({
        success: true,
        message: 'Room availability data retrieved successfully',
        data: {
          date: targetDate.toISOString().split('T')[0],
          overall,
          byRoomType: availabilityData
        }
      });
    } catch (error) {
      console.error('Error fetching room availability:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching room availability data',
        error: error.message
      });
    }
  }

  /**
   * Retrieves detailed availability for a specific room type.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string} req.params.roomTypeId - The ID of the room type.
   * @param {Object} req.query - The query parameters.
   * @param {string} [req.query.date] - The specific date to check.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing detailed availability for the room type.
   */
  static async getRoomTypeAvailability(req, res) {
    try {
      const { roomTypeId } = req.params;
      const { date } = req.query;

      const Op = require('sequelize').Op;

      const roomType = await RoomType.findByPk(roomTypeId, {
        include: [
          {
            model: Room,
            as: 'rooms',
            where: date ? {} : undefined,
            include: [
              {
                model: Booking,
                as: 'bookings',
                where: date ? {
                  status: {
                    [Op.in]: ['confirmed', 'checked_in']
                  },
                  [Op.or]: [
                    {
                      checkInDate: { [Op.lte]: new Date(date) },
                      checkOutDate: { [Op.gt]: new Date(date) }
                    },
                    {
                      checkInDate: { [Op.lte]: new Date(date) },
                      checkOutDate: { [Op.gte]: new Date(date) }
                    }
                  ]
                } : undefined,
                required: false
              }
            ]
          }
        ]
      });

      if (!roomType) {
        return res.status(404).json({
          success: false,
          message: 'Room type not found'
        });
      }

      res.json({
        success: true,
        message: 'Room type availability data retrieved successfully',
        data: {
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          basePrice: parseFloat(roomType.basePrice),
          rooms: roomType.rooms.map(room => ({
            id: room.id,
            roomNumber: room.roomNumber,
            status: room.status,
            currentBooking: room.bookings && room.bookings.length > 0 
              ? {
                  id: room.bookings[0].id,
                  checkInDate: room.bookings[0].checkInDate,
                  checkOutDate: room.bookings[0].checkOutDate,
                  status: room.bookings[0].status
                }
              : null
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching room type availability:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching room type availability data',
        error: error.message
      });
    }
  }
}

module.exports = RoomAvailabilityController;