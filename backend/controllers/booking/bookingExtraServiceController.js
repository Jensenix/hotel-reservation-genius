import bookingExtraServiceService from '#services/booking/bookingExtraServiceService.js';

class BookingExtraServiceController {
  createBookingExtraService = async (req, res) => {
    try {
      const data = await bookingExtraServiceService.createBookingExtraService(
        req.body,
      );
      res.status(201).json({ success: true, data });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({
          message: error.message || 'Failed to create booking extra service',
          error: error.message,
        });
    }
  };

  getBookingExtraServicesByBookingId = async (req, res) => {
    try {
      const data =
        await bookingExtraServiceService.getBookingExtraServicesByBookingId(
          req.params.bookingId,
        );
      res.status(200).json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({
          message: 'Failed to fetch booking extra services',
          error: error.message,
        });
    }
  };

  deleteBookingExtraService = async (req, res) => {
    try {
      await bookingExtraServiceService.deleteBookingExtraService(req.params.id);
      res
        .status(200)
        .json({
          success: true,
          message: 'Booking extra service deleted successfully',
        });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({
          message: error.message || 'Failed to delete booking extra service',
          error: error.message,
        });
    }
  };
}

export default new BookingExtraServiceController();
