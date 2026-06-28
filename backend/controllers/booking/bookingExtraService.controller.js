import BaseController from '#controllers/base/base.controller.js';
import bookingExtraServiceService from '#services/booking/bookingExtraService.service.js';

class BookingExtraServiceController extends BaseController {
  createBookingExtraService = this.asyncHandler(async (req, res) => {
    const data = await bookingExtraServiceService.createBookingExtraService(req.body);
    this.sendCreated(res, 'Booking extra service created successfully', data);
  });

  getBookingExtraServicesByBookingId = this.asyncHandler(async (req, res) => {
    const data = await bookingExtraServiceService.getBookingExtraServicesByBookingId(
      req.params.bookingId,
    );
    this.sendSuccess(res, 'Booking extra services retrieved successfully', data);
  });

  deleteBookingExtraService = this.asyncHandler(async (req, res) => {
    await bookingExtraServiceService.deleteBookingExtraService(req.params.id);
    this.sendSuccess(res, 'Booking extra service deleted successfully');
  });
}

export default new BookingExtraServiceController();