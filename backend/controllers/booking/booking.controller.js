import bookingService from '#services/booking/booking.service.js';
import BaseController from '../base/base.controller.js';
import { sendResponse } from '#utils/responseHandler.js';

class BookingController extends BaseController {
  constructor() {
    super(bookingService, 'Booking');
  }

  // Map implicit base methods to align directly with your current router syntax rules
  createBooking = this.create;
  getAllBookings = this.getAll;
  getBookingById = this.getById;
  updateBooking = this.update;
  deleteBooking = this.delete;

  /**
   * Checks general room availability
   */
  checkRoomAvailability = async (req, res, next) => {
    try {
      const data = await this.service.checkRoomAvailability(req.query);
      return sendResponse(res, 200, 'Availability checked successfully', data);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves specific available rooms based on parameters
   */
  getAvailableRooms = async (req, res, next) => {
    try {
      const data = await this.service.getAvailableRooms(req.query);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'Available rooms retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Confirms a pending booking (Admin)
   */
  confirmBooking = async (req, res, next) => {
    try {
      const booking = await this.service.confirmBooking(req.params.id);
      return sendResponse(res, 200, 'Booking confirmed successfully', booking);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles check-in processing for a given booking.
   */
  checkInGuest = async (req, res, next) => {
    try {
      const booking = await this.service.checkInGuest(req.params.id);
      return sendResponse(res, 200, 'Guest checked in successfully', booking);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles check-out processing for a given booking.
   */
  checkOutGuest = async (req, res, next) => {
    try {
      const booking = await this.service.checkOutGuest(req.params.id);
      return sendResponse(res, 200, 'Guest checked out successfully', booking);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles booking cancellation rules.
   */
  cancelBooking = async (req, res, next) => {
    try {
      const booking = await this.service.cancelBooking(req.params.id, req.body.reason);
      return sendResponse(res, 200, 'Booking cancelled successfully', booking);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fetches specific user reservation history.
   */
  getUserBookings = async (req, res, next) => {
    try {
      const data = await this.service.getUserBookings(req.params.userId);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'User bookings retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fetches the administration view listing metrics.
   */
  getAllBookingsAdmin = async (req, res, next) => {
    try {
      const data = await this.service.getAllBookingsAdmin(req.query);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'Admin bookings retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();