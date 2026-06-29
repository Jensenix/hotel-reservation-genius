import BaseController from '#controllers/base/base.controller.js';
import bookingService from '#services/booking/booking.service.js';

class BookingController extends BaseController {
  /**
   * Creates a new booking.
   * @param {Object} req - Request object containing booking body
   * @param {Object} res - Response object
   */
  createBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.createBooking(req.body);
    this.sendCreated(res, 'Booking created successfully', data);
  });

  /**
   * Retrieves all bookings with pagination support.
   * @param {Object} req - Request object with query params
   * @param {Object} res - Response object
   */
  getAllBookings = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getAllBookings(req.query);
    this.sendPaginated(
      res,
      'Bookings retrieved successfully',
      data.rows,
      data.pagination,
    );
  });

  /**
   * Retrieves a specific booking by its ID.
   */
  getBookingById = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getBookingById(req.params.id);
    this.sendSuccess(res, 'Booking retrieved successfully', data);
  });

  /**
   * Updates an existing booking.
   */
  updateBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.updateBooking(req.params.id, req.body);
    this.sendSuccess(res, 'Booking updated successfully', data);
  });

  /**
   * Deletes a booking record.
   */
  deleteBooking = this.asyncHandler(async (req, res) => {
    await bookingService.deleteBooking(req.params.id);
    this.sendSuccess(res, 'Booking deleted successfully');
  });

  /**
   * Checks room availability for a specified date range.
   */
  checkRoomAvailability = this.asyncHandler(async (req, res) => {
    const { roomId, checkInDate, checkOutDate } = req.query;
    const available = await bookingService.checkRoomAvailability(
      roomId,
      checkInDate,
      checkOutDate,
    );
    this.sendSuccess(res, 'Room availability checked successfully', {
      roomId,
      checkInDate,
      checkOutDate,
      available,
    });
  });

  /**
   * Retrieves all available rooms for a room type within a date range.
   */
  getAvailableRooms = this.asyncHandler(async (req, res) => {
    const { checkInDate, checkOutDate, roomTypeId } = req.query;
    const data = await bookingService.getAvailableRooms(
      checkInDate,
      checkOutDate,
      roomTypeId,
    );
    this.sendSuccess(res, 'Available rooms retrieved successfully', data);
  });

  /**
   * Confirms a booking.
   */
  confirmBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.confirmBooking(req.params.id);
    this.sendSuccess(res, 'Booking confirmed successfully', data);
  });

  /**
   * Marks a booking as checked-in.
   */
  checkInGuest = this.asyncHandler(async (req, res) => {
    const data = await bookingService.checkInGuest(req.params.id);
    this.sendSuccess(res, 'Guest checked in successfully', data);
  });

  /**
   * Marks a booking as checked-out.
   */
  checkOutGuest = this.asyncHandler(async (req, res) => {
    const data = await bookingService.checkOutGuest(req.params.id);
    this.sendSuccess(res, 'Guest checked out successfully', data);
  });

  /**
   * Cancels a booking.
   */
  cancelBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.cancelBooking(
      req.params.id,
      req.body.reason,
    );
    this.sendSuccess(res, 'Booking cancelled successfully', data);
  });

  /**
   * Retrieves all bookings for a specific user.
   */
  getUserBookings = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getUserBookings(req.params.userId);
    this.sendSuccess(res, 'User bookings retrieved successfully', data);
  });

  /**
   * Retrieves all bookings (Admin view).
   */
  getAllBookingsAdmin = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getAllBookingsAdmin(req.query);
    this.sendSuccess(res, 'Bookings retrieved successfully', data);
  });

  /**
   * Allows a user to check themselves into their own booking.
   */
  selfCheckIn = this.asyncHandler(async (req, res) => {
    const data = await bookingService.selfCheckIn(req.params.id, req.user.id);
    this.sendSuccess(res, 'Successfully checked in', data);
  });

  /**
   * Allows a user to check themselves out of their own booking.
   */
  selfCheckOut = this.asyncHandler(async (req, res) => {
    const data = await bookingService.selfCheckOut(req.params.id, req.user.id);
    this.sendSuccess(res, 'Checked out successfully', data);
  });
}

export default new BookingController();
