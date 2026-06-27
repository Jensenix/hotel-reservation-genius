import db from '#models/index.js';
const { BookingExtraService, Booking, ExtraService } = db;
import BaseService from '../base/baseService.js';

class BookingExtraServiceService extends BaseService {
  constructor() {
    super(BookingExtraService, 'Booking extra service');
  }

  /**
   * Assigns an extra service to a booking.
   * @param {Object} data - The assignment data.
   * @param {string|number} data.bookingId - The ID of the booking.
   * @param {string|number} data.extraServiceId - The ID of the extra service to add.
   * @param {number} data.quantity - The quantity of the service requested.
   * @param {number} data.subtotal - The calculated subtotal for this service.
   * @returns {Promise<Object>} The created booking extra service record.
   * @throws {Error} If the booking or extra service is not found.
   */
  async createBookingExtraService({
    bookingId,
    extraServiceId,
    quantity,
    subtotal,
  }) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const extraService = await ExtraService.findByPk(extraServiceId);
    if (!extraService) {
      const err = new Error('Extra service not found');
      err.statusCode = 404;
      throw err;
    }

    return super.create({ bookingId, extraServiceId, quantity, subtotal });
  }

  /**
   * Retrieves all extra services associated with a specific booking ID.
   * @param {string|number} bookingId - The ID of the booking.
   * @returns {Promise<Array>} List of booking extra services.
   */
  async getBookingExtraServicesByBookingId(bookingId) {
    return super.getAll({
      where: { bookingId },
      include: [{ model: ExtraService, as: 'extraService' }],
    });
  }

  /**
   * Deletes an extra service tied to a booking.
   * @param {string|number} id - The primary key ID of the booking extra service record.
   * @returns {Promise<void>}
   * @throws {Error} If the booking extra service is not found.
   */
  async deleteBookingExtraService(id) {
    return super.delete(id);
  }
}

export default new BookingExtraServiceService();
