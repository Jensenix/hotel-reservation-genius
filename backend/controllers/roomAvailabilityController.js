const { Room, RoomType, Booking } = require('../models');

class RoomAvailabilityController {
  // Get room availability statistics by room type
  static async getRoomAvailability(req, res) {
    try {
      const { date } = req.query;
      
      const Op = require('sequelize').Op;
      
      // Default to today if no date provided
      const targetDate = date ? new Date(date) : new Date();
      
      // Set date boundaries for the target day
      const targetDateStart = new Date(targetDate);
      targetDateStart.setHours(0, 0, 0, 0);
      
      const targetDateEnd = new Date(targetDate);
      targetDateEnd.setHours(23, 59, 59, 999);

      // Get all room types with their physical rooms
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
        
        // Get all bookings that overlap with the target date
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
            [Op.and]: [
              { checkInDate: { [Op.lte]: targetDateEnd } },
              { checkOutDate: { [Op.gt]: targetDateStart } }
            ]
          }
        });

        // Get booked room IDs for this date
        const bookedRoomIds = bookings.map(b => b.roomId);
        
        // Count rooms by physical status
        const maintenanceRooms = roomType.rooms.filter(r => r.status === 'maintenance').length;
        const cleaningRooms = roomType.rooms.filter(r => r.status === 'cleaning').length;
        
        // Calculate available rooms: not booked AND not in maintenance/cleaning
        const availableRooms = roomType.rooms.filter(
          room => !bookedRoomIds.includes(room.id) && 
                   room.status === 'available'
        ).length;
        
        // Calculate occupied rooms: either booked OR status is occupied
        const occupiedRooms = roomType.rooms.filter(
          room => bookedRoomIds.includes(room.id) || room.status === 'occupied'
        ).length;

        const availabilityPercentage = totalPhysicalRooms > 0 
          ? Math.round((availableRooms / totalPhysicalRooms) * 100) 
          : 0;

        // Detailed room list with accurate status
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

      // Calculate overall statistics
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
