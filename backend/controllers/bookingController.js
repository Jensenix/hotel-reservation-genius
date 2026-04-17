const { Booking, User, Room, Payment, Review, ExtraService, RoomType, PaymentMethod } = require('../models');
const pagination = require('../utils/pagination');
const BookingUtils = require('../utils/bookingUtils');

class BookingController {
  // Create new booking
  async createBooking(req, res) {
    try {
      const { userId, roomTypeId, checkInDate, checkOutDate, totalPrice, status } = req.body;

      // Manual validation
      if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'userId, roomTypeId, checkInDate, and checkOutDate are required'
        });
      }

      // Find available room for this room type
      const availableRoom = await BookingUtils.findAvailableRoom(roomTypeId, checkInDate, checkOutDate);
      if (!availableRoom) {
        return res.status(400).json({
          success: false,
          message: 'All rooms of this type are fully booked for the selected dates'
        });
      }

      const roomId = availableRoom.id;

      // Calculate total price if not provided
      let calculatedPrice = totalPrice;
      if (!totalPrice) {
        calculatedPrice = await BookingUtils.calculateTotalPrice(roomTypeId, checkInDate, checkOutDate);
      }

      const booking = await Booking.create({
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice: calculatedPrice,
        status: status || 'pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  }

  // Get all bookings with pagination and filtering
  async getAllBookings(req, res) {
    try {
      const { page = 1, limit = 10, status, userId, roomId } = req.query;

      const where = {};

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Filter by user
      if (userId) {
        where.userId = userId;
      }

      // Filter by room
      if (roomId) {
        where.roomId = roomId;
      }

      const parsedLimit = parseInt(limit);
      const offset = (parseInt(page) - 1) * parsedLimit;

      const { count, rows } = await Booking.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: require('../models').User,
            as: 'user',
            attributes: ['id', 'fullName', 'email', 'phoneNumber']
          },
          {
            model: require('../models').Room,
            as: 'room',
            include: [
              {
                model: require('../models').RoomType,
                as: 'roomType',
                attributes: ['id', 'name', 'basePrice']
              }
            ]
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parsedLimit),
          totalItems: count,
          itemsPerPage: parsedLimit
        }
      });
    } catch (error) {
      console.error('Error getting bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting bookings',
        error: error.message
      });
    }
  }

  // Get booking by ID
  async getBookingById(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          },
          {
            model: Room,
            as: 'room',
            include: ['roomType']
          },
          {
            model: Payment,
            as: 'payment',
            include: [
              {
                model: PaymentMethod,
                as: 'paymentMethod'
              }
            ]
          },
          {
            model: Review,
            as: 'reviews'
          },
          {
            model: ExtraService,
            as: 'extraServices',
            through: {
              attributes: ['quantity', 'subtotal']
            }
          }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking retrieved successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error getting booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting booking',
        error: error.message
      });
    }
  }

  // Update booking
  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const { userId, roomId, checkInDate, checkOutDate, totalPrice, status } = req.body;

      const booking = await Booking.findByPk(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.update({
        userId: userId || booking.userId,
        roomId: roomId || booking.roomId,
        checkInDate: checkInDate || booking.checkInDate,
        checkOutDate: checkOutDate || booking.checkOutDate,
        totalPrice: totalPrice || booking.totalPrice,
        status: status || booking.status
      });

      return res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating booking',
        error: error.message
      });
    }
  }

  // Delete booking
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.destroy();

      return res.status(200).json({
        success: true,
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting booking',
        error: error.message
      });
    }
  }

  // Check room availability
  async checkRoomAvailability(req, res) {
    try {
      const { roomId, checkInDate, checkOutDate } = req.query;

      if (!roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'roomId, checkInDate, and checkOutDate are required'
        });
      }

      const isAvailable = await BookingUtils.checkRoomAvailability(roomId, checkInDate, checkOutDate);

      return res.status(200).json({
        success: true,
        message: 'Room availability checked successfully',
        data: {
          roomId,
          checkInDate,
          checkOutDate,
          available: isAvailable
        }
      });
    } catch (error) {
      console.error('Error checking room availability:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking room availability',
        error: error.message
      });
    }
  }

  // Get available rooms for date range
  async getAvailableRooms(req, res) {
    try {
      const { checkInDate, checkOutDate, roomTypeId } = req.query;

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'checkInDate and checkOutDate are required'
        });
      }

      const availableRooms = await BookingUtils.getAvailableRooms(checkInDate, checkOutDate, roomTypeId);

      return res.status(200).json({
        success: true,
        message: 'Available rooms retrieved successfully',
        data: availableRooms
      });
    } catch (error) {
      console.error('Error getting available rooms:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting available rooms',
        error: error.message
      });
    }
  }

  // Admin: Confirm booking
  async confirmBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: require('../models').User, as: 'user' },
          { 
            model: require('../models').Room, 
            as: 'room', 
            include: [{ model: require('../models').RoomType, as: 'roomType' }] 
          },
          { model: require('../models').Payment, as: 'payment' }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Booking cannot be confirmed'
        });
      }

      await booking.update({ status: 'confirmed' });

      return res.status(200).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error confirming booking',
        error: error.message
      });
    }
  }

  // Admin: Check-in guest
  async checkInGuest(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] },
          { model: require('../models').Payment, as: 'payment' }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'Only confirmed bookings can be checked in'
        });
      }

      // Update room status to occupied
      await booking.room.update({ status: 'occupied' });
      
      // Update booking status
      await booking.update({ 
        status: 'checked_in',
        actualCheckIn: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Guest checked in successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error checking in guest:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking in guest',
        error: error.message
      });
    }
  }

  // Admin: Check-out guest
  async checkOutGuest(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] },
          { model: require('../models').Payment, as: 'payment' }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.status !== 'checked_in') {
        return res.status(400).json({
          success: false,
          message: 'Only checked-in guests can be checked out'
        });
      }

      // Update room status to available/cleaning
      await booking.room.update({ status: 'available' });
      
      // Update booking status
      await booking.update({ 
        status: 'checked_out',
        actualCheckOut: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Guest checked out successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error checking out guest:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking out guest',
        error: error.message
      });
    }
  }

  // Admin: Cancel booking (soft delete)
  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] },
          { model: require('../models').Payment, as: 'payment' }
        ]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (booking.status === 'checked_in') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel checked-in booking'
        });
      }

      // Update room status to available if it was occupied
      if (booking.room.status === 'occupied') {
        await booking.room.update({ status: 'available' });
      }

      await booking.update({ 
        status: 'cancelled',
        cancelReason: reason || 'Cancelled by admin',
        cancelledAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return res.status(500).json({
        success: false,
        message: 'Error cancelling booking',
        error: error.message
      });
    }
  }

  // Admin: Get all bookings with filters
  async getAllBookingsAdmin(req, res) {
    try {
      const { 
        status, 
        search,
        checkInDate, 
        checkOutDate, 
        userId, 
        page = 1, 
        limit = 10 
      } = req.query;

      const where = {};
      
      if (status) where.status = status;
      if (checkInDate) where.checkInDate = { [require('sequelize').Op.gte]: checkInDate };
      if (checkOutDate) where.checkOutDate = { [require('sequelize').Op.lte]: checkOutDate };
      if (userId) where.userId = userId;
      if (search) {
        where.id = { [require('sequelize').Op.eq]: parseInt(search) };
      }

      const { count, rows: bookings } = await Booking.findAndCountAll({
        where,
        include: [
          { 
            model: require('../models').User, 
            as: 'user', 
            attributes: ['id', 'fullName', 'email', 'phoneNumber'] 
          },
          { 
            model: require('../models').Room, 
            as: 'room', 
            include: [
              { 
                model: require('../models').RoomType, 
                as: 'roomType', 
                attributes: ['id', 'name'] 
              }
            ],
            attributes: ['id', 'roomNumber', 'status']
          },
          { 
            model: require('../models').Payment, 
            as: 'payment' 
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: {
          bookings,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting admin bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting admin bookings',
        error: error.message
      });
    }
  }
}

module.exports = new BookingController();
