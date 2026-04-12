const { Booking, User, Room, Payment, Review, ExtraService } = require('../models');
const pagination = require('../utils/pagination');

class BookingController {
  // Create new booking
  async createBooking(req, res) {
    try {
      const { userId, roomId, checkInDate, checkOutDate, totalPrice, status } = req.body;

      // Manual validation
      if (!userId || !roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'userId, roomId, checkInDate, and checkOutDate are required'
        });
      }

      const booking = await Booking.create({
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice,
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

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await Booking.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']],
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
            as: 'payment'
          },
          {
            model: Review,
            as: 'reviews'
          },
          {
            model: ExtraService,
            as: 'extraServices'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData(count, page, parsedLimit)
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
            as: 'payment'
          },
          {
            model: Review,
            as: 'reviews'
          },
          {
            model: ExtraService,
            as: 'extraServices'
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
}

module.exports = new BookingController();
