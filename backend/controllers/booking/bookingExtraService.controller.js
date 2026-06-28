import bookingExtraServiceService from '#services/booking/bookingExtraService.service.js';
import BaseController from '../base/base.controller.js';
import { sendResponse } from '#utils/responseHandler.js';

class BookingExtraServiceController extends BaseController {
  constructor() {
    super(bookingExtraServiceService, 'Booking extra service');
  }

  createBookingExtraService = this.create;
  deleteBookingExtraService = this.delete;

  /**
   * Custom relation lookup to get all extra amenities tied to a particular reservation record.
   */
  getBookingExtraServicesByBookingId = async (req, res, next) => {
    try {
      const data = await this.service.getBookingExtraServicesByBookingId(req.params.bookingId);
      
      const records = data?.rows ? data.rows : (Array.isArray(data) ? data : []);
      const pagination = data?.pagination || null;

      return sendResponse(res, 200, 'Booking extra services retrieved successfully', records, pagination);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingExtraServiceController();