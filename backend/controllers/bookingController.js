const { Booking, User, Room, Payment, Review, ExtraService, RoomType, PaymentMethod } = require('../models');
const pagination = require('../utils/pagination');
const BookingUtils = require('../utils/bookingUtils');

class BookingController {
  /**
   * Creates a new booking.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the created booking.
   */
  async createBooking(req, res) {
    try {
      const { userId, roomTypeId, checkInDate, checkOutDate, totalPrice, status } = req.body;

      if (!userId || !roomTypeId || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: 'userId, roomTypeId, checkInDate, and checkOutDate are required'
        });
      }

      const availableRoom = await BookingUtils.findAvailableRoom(roomTypeId, checkInDate, checkOutDate);
      if (!availableRoom) {
        return res.status(400).json({
          success: false,
          message: 'All rooms of this type are fully booked for the selected dates'
        });
      }

      const roomId = availableRoom.id;
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

  /**
   * Retrieves all bookings with pagination and filtering.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing bookings and pagination details.
   */
  async getAllBookings(req, res) {
    try {
      const { page = 1, limit = 10, status, userId, roomId } = req.query;
      const where = {};

      if (status) where.status = status;
      if (userId) where.userId = userId;
      if (roomId) where.roomId = roomId;

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
                attributes: ['id', 'name', 'basePrice', 'maxCapacity']
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

  /**
   * Retrieves a specific booking by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the booking details.
   */
  async getBookingById(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
          { model: Payment, as: 'payment', include: [{ model: PaymentMethod, as: 'paymentMethod' }] },
          { model: Review, as: 'reviews' },
          { model: ExtraService, as: 'extraServices', through: { attributes: ['quantity', 'subtotal'] } }
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

  /**
   * Updates an existing booking.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated booking.
   */
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

  /**
   * Deletes a booking by its ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
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

  /**
   * Checks the availability of a specific room.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with availability status.
   */
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
        data: { roomId, checkInDate, checkOutDate, available: isAvailable }
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

  /**
   * Retrieves available rooms for a given date range.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing an array of available rooms.
   */
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

  /**
   * Confirms a pending booking.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the confirmed booking.
   */
  async confirmBooking(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: require('../models').User, as: 'user' },
          { model: require('../models').Room, as: 'room', include: [{ model: require('../models').RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
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

  /**
   * Processes a guest check-in.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming the check-in.
   */
  async checkInGuest(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
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

      await booking.room.update({ status: 'occupied' });
      await booking.update({ status: 'checked_in', actualCheckIn: new Date() });

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

  /**
   * Processes a guest check-out.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming the check-out.
   */
  async checkOutGuest(req, res) {
    try {
      const { id } = req.params;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
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

      await booking.room.update({ status: 'available' });
      await booking.update({ status: 'checked_out', actualCheckOut: new Date() });

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

  /**
   * Cancels a booking (soft delete or status update).
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming cancellation.
   */
  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
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

  /**
   * Retrieves all bookings for a specific user.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the user's bookings.
   */
  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const bookings = await Booking.findAll({
        where: { userId },
        include: [
          { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phoneNumber'] },
          { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType', attributes: ['id', 'name', 'basePrice', 'maxCapacity'] }] },
          { model: Payment, as: 'payment', attributes: ['id', 'paymentMethodId', 'amount', 'paymentStatus', 'transactionTime'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'User bookings retrieved successfully',
        data: bookings
      });
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting user bookings',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all bookings with extended admin filters and formatting.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with filtered admin bookings.
   */
  async getAllBookingsAdmin(req, res) {
    try {
      const { status, search, checkInDate, checkOutDate, userId, page = 1, limit = 10 } = req.query;

      const sanitizedPage = Math.max(1, parseInt(page) || 1);
      const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
      
      const where = {};
      
      const statusMapping = {
        'pending': 'pending',
        'confirmed': 'confirmed', 
        'checked-in': 'checked_in',
        'checked-out': 'checked_out',
        'cancelled': 'cancelled'
      };
      
      if (status && statusMapping[status]) {
        where.status = statusMapping[status];
      }
      
      if (checkInDate && !isNaN(Date.parse(checkInDate))) {
        where.checkInDate = { [require('sequelize').Op.gte]: checkInDate };
      }
      if (checkOutDate && !isNaN(Date.parse(checkOutDate))) {
        where.checkOutDate = { [require('sequelize').Op.lte]: checkOutDate };
      }
      
      if (userId) {
        const userIdNum = parseInt(userId);
        if (!isNaN(userIdNum) && userIdNum > 0) {
          where.userId = userIdNum;
        }
      }

      if (search) {
        const searchId = parseInt(search);
        if (!isNaN(searchId) && searchId > 0) {
          where.id = { [require('sequelize').Op.eq]: searchId };
        } else {
          where[require('sequelize').Op.or] = [
            { '$user.fullName$': { [require('sequelize').Op.iLike]: `%${search}%` } }
          ];
        }
      }

      const { count, rows: bookings } = await Booking.findAndCountAll({
        where,
        include: [
          { model: require('../models').User, as: 'user', attributes: ['id', 'fullName', 'email', 'phoneNumber'] },
          { model: require('../models').Room, as: 'room', include: [{ model: require('../models').RoomType, as: 'roomType', attributes: ['id', 'name', 'maxCapacity'] }], attributes: ['id', 'roomNumber', 'status'] },
          { model: require('../models').Payment, as: 'payment' }
        ],
        order: [['createdAt', 'DESC']],
        limit: sanitizedLimit,
        offset: (sanitizedPage - 1) * sanitizedLimit
      });

      const responseStatusMapping = {
        'pending': 'pending',
        'confirmed': 'confirmed',
        'checked_in': 'checked-in',
        'checked_out': 'checked-out',
        'cancelled': 'cancelled'
      };

      const mappedBookings = bookings.map(booking => ({
        ...booking.toJSON(),
        status: responseStatusMapping[booking.status] || booking.status
      }));

      return res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data: {
          bookings: mappedBookings,
          pagination: {
            currentPage: sanitizedPage,
            totalPages: Math.ceil(count / sanitizedLimit),
            totalItems: count,
            itemsPerPage: sanitizedLimit
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