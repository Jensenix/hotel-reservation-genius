const bookingService = require('../services/booking/bookingService');

class BookingController {
  async createBooking(req, res) {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error creating booking' });
    }
  }

  async getAllBookings(req, res) {
    try {
      const data = await bookingService.getAllBookings(req.query);
      res.status(200).json({ success: true, message: 'Bookings retrieved successfully', data: data.rows, pagination: data.pagination });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error getting bookings', error: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({ success: true, message: 'Booking retrieved successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error getting booking' });
    }
  }

  async updateBooking(req, res) {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Booking updated successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error updating booking' });
    }
  }

  async deleteBooking(req, res) {
    try {
      await bookingService.deleteBooking(req.params.id);
      res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error deleting booking' });
    }
  }

  async checkRoomAvailability(req, res) {
    try {
      const { roomId, checkInDate, checkOutDate } = req.query;
      const available = await bookingService.checkRoomAvailability(roomId, checkInDate, checkOutDate);
      res.status(200).json({ success: true, message: 'Room availability checked successfully', data: { roomId, checkInDate, checkOutDate, available } });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error checking room availability' });
    }
  }

  async getAvailableRooms(req, res) {
    try {
      const { checkInDate, checkOutDate, roomTypeId } = req.query;
      const rooms = await bookingService.getAvailableRooms(checkInDate, checkOutDate, roomTypeId);
      res.status(200).json({ success: true, message: 'Available rooms retrieved successfully', data: rooms });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error getting available rooms' });
    }
  }

  async confirmBooking(req, res) {
    try {
      const booking = await bookingService.confirmBooking(req.params.id);
      res.status(200).json({ success: true, message: 'Booking confirmed successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error confirming booking' });
    }
  }

  async checkInGuest(req, res) {
    try {
      const booking = await bookingService.checkInGuest(req.params.id);
      res.status(200).json({ success: true, message: 'Guest checked in successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error checking in guest' });
    }
  }

  async checkOutGuest(req, res) {
    try {
      const booking = await bookingService.checkOutGuest(req.params.id);
      res.status(200).json({ success: true, message: 'Guest checked out successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error checking out guest' });
    }
  }

  async cancelBooking(req, res) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.body.reason);
      res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error cancelling booking' });
    }
  }

  async getUserBookings(req, res) {
    try {
      const bookings = await bookingService.getUserBookings(req.params.userId);
      res.status(200).json({ success: true, message: 'User bookings retrieved successfully', data: bookings });
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error getting user bookings' });
    }
  }

  async getAllBookingsAdmin(req, res) {
    try {
      const data = await bookingService.getAllBookingsAdmin(req.query);
      res.status(200).json({ success: true, message: 'Bookings retrieved successfully', data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error getting admin bookings', error: error.message });
    }
  }
}

module.exports = new BookingController();