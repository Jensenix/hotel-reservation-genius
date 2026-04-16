const { Room, RoomType, Booking } = require('../models');

class RoomAvailabilityController {
  // Get room availability statistics by room type
  static async getRoomAvailability(req, res) {
    try {
      const { date } = req.query;
      
      const Op = require('sequelize').Op;
      
      // Build date filter for bookings
      let dateFilter = {};
      if (date) {
        const targetDate = new Date(date);
        dateFilter = {
          [Op.or]: [
            {
              checkInDate: { [Op.lte]: targetDate },
              checkOutDate: { [Op.gt]: targetDate }
            },
            {
              checkInDate: { [Op.lte]: targetDate },
              checkOutDate: { [Op.gte]: targetDate }
            }
          ]
        };
      }

      // Get all room types
      const roomTypes = await RoomType.findAll({
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: ['id', 'roomNumber', 'status']
          }
        ]
      });

      // Calculate availability for each room type
      const availabilityStats = await Promise.all(
        roomTypes.map(async (roomType) => {
          const totalRooms = roomType.rooms.length;
          
          // Count rooms by status
          const availableRooms = roomType.rooms.filter(room => room.status === 'available').length;
          const occupiedRooms = roomType.rooms.filter(room => room.status === 'occupied').length;
          const maintenanceRooms = roomType.rooms.filter(room => room.status === 'maintenance').length;
          const cleaningRooms = roomType.rooms.filter(room => room.status === 'cleaning').length;

          // Get bookings for this room type on the specified date
          const bookings = await Booking.findAll({
            include: [
              {
                model: Room,
                as: 'room',
                where: {
                  roomTypeId: roomType.id
                }
              }
            ],
            where: {
              status: {
                [Op.in]: ['confirmed', 'checked_in']
              },
              ...dateFilter
            }
          });

          const bookedRooms = bookings.length;

          return {
            roomTypeId: roomType.id,
            roomTypeName: roomType.name,
            basePrice: parseFloat(roomType.basePrice),
            totalRooms,
            availableRooms,
            occupiedRooms,
            bookedRooms,
            maintenanceRooms,
            cleaningRooms,
            availabilityPercentage: totalRooms > 0 
              ? Math.round((availableRooms / totalRooms) * 100) 
              : 0,
            rooms: roomType.rooms.map(room => ({
              id: room.id,
              roomNumber: room.roomNumber,
              status: room.status
            }))
          };
        })
      );

      // Calculate overall statistics
      const totalAllRooms = availabilityStats.reduce((sum, stat) => sum + stat.totalRooms, 0);
      const totalAvailableRooms = availabilityStats.reduce((sum, stat) => sum + stat.availableRooms, 0);
      const totalOccupiedRooms = availabilityStats.reduce((sum, stat) => sum + stat.occupiedRooms, 0);
      const totalBookedRooms = availabilityStats.reduce((sum, stat) => sum + stat.bookedRooms, 0);
      const totalMaintenanceRooms = availabilityStats.reduce((sum, stat) => sum + stat.maintenanceRooms, 0);

      res.json({
        success: true,
        message: 'Room availability data retrieved successfully',
        data: {
          overall: {
            totalRooms: totalAllRooms,
            availableRooms: totalAvailableRooms,
            occupiedRooms: totalOccupiedRooms,
            bookedRooms: totalBookedRooms,
            maintenanceRooms: totalMaintenanceRooms,
            occupancyRate: totalAllRooms > 0 
              ? Math.round((totalOccupiedRooms / totalAllRooms) * 100) 
              : 0,
            availabilityRate: totalAllRooms > 0 
              ? Math.round((totalAvailableRooms / totalAllRooms) * 100) 
              : 0
          },
          byRoomType: availabilityStats
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

  // Get detailed availability for a specific room type
  static async getRoomTypeAvailability(req, res) {
    try {
      const { roomTypeId } = req.params;
      const { date } = req.query;

      const Op = require('sequelize').Op;

      // Get room type with rooms
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
