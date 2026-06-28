import BaseController from '#controllers/base/base.controller.js';
import bookingService from '#services/booking/booking.service.js';

class BookingController extends BaseController {
  createBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.createBooking(req.body);
    this.sendCreated(res, 'Booking created successfully', data);
  });

  getAllBookings = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getAllBookings(req.query);
    this.sendPaginated(res, 'Bookings retrieved successfully', data.rows, data.pagination);
  });

  getBookingById = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getBookingById(req.params.id);
    this.sendSuccess(res, 'Booking retrieved successfully', data);
  });

  updateBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.updateBooking(req.params.id, req.body);
    this.sendSuccess(res, 'Booking updated successfully', data);
  });

  deleteBooking = this.asyncHandler(async (req, res) => {
    await bookingService.deleteBooking(req.params.id);
    this.sendSuccess(res, 'Booking deleted successfully');
  });

  /**
   * Preserves the original response shape where roomId, checkInDate,
   * and checkOutDate are echoed back alongside the availability flag.
   * The frontend likely renders all four fields from data.
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

  getAvailableRooms = this.asyncHandler(async (req, res) => {
    const { checkInDate, checkOutDate, roomTypeId } = req.query;
    const data = await bookingService.getAvailableRooms(
      checkInDate,
      checkOutDate,
      roomTypeId,
    );
    this.sendSuccess(res, 'Available rooms retrieved successfully', data);
  });

  confirmBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.confirmBooking(req.params.id);
    this.sendSuccess(res, 'Booking confirmed successfully', data);
  });

  checkInGuest = this.asyncHandler(async (req, res) => {
    const data = await bookingService.checkInGuest(req.params.id);
    this.sendSuccess(res, 'Guest checked in successfully', data);
  });

  checkOutGuest = this.asyncHandler(async (req, res) => {
    const data = await bookingService.checkOutGuest(req.params.id);
    this.sendSuccess(res, 'Guest checked out successfully', data);
  });

  cancelBooking = this.asyncHandler(async (req, res) => {
    const data = await bookingService.cancelBooking(req.params.id, req.body.reason);
    this.sendSuccess(res, 'Booking cancelled successfully', data);
  });

  getUserBookings = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getUserBookings(req.params.userId);
    this.sendSuccess(res, 'User bookings retrieved successfully', data);
  });

  getAllBookingsAdmin = this.asyncHandler(async (req, res) => {
    const data = await bookingService.getAllBookingsAdmin(req.query);
    this.sendSuccess(res, 'Bookings retrieved successfully', data);
  });
}

export default new BookingController();