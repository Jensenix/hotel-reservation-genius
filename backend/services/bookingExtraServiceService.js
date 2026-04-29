const { BookingExtraService, ExtraService, Booking } = require('../models');

class BookingExtraServiceService {
  /**
   * Assigns an extra service to a booking.
   * @param {Object} data - The assignment data.
   * @returns {Promise<Object>} The created booking extra service.
   */
  async createBookingExtraService({ bookingId, extraServiceId, quantity, subtotal }) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      const err = new Error('Booking not found'); err.statusCode = 404; throw err;
    }

    const extraService = await ExtraService.findByPk(extraServiceId);
    if (!extraService) {
      const err = new Error('Extra service not found'); err.statusCode = 404; throw err;
    }

    return BookingExtraService.create({ bookingId, extraServiceId, quantity, subtotal });
  }

  /**
   * Retrieves all extra services associated with a specific booking ID.
   * @param {string|number} bookingId - The booking ID.
   * @returns {Promise<Array>} List of booking extra services.
   */
  async getBookingExtraServicesByBookingId(bookingId) {
    return BookingExtraService.findAll({
      where: { bookingId },
      include: [{ model: ExtraService, as: 'extraService' }]
    });
  }

  /**
   * Deletes an extra service tied to a booking.
   * @param {string|number} id - The primary key ID.
   * @returns {Promise<void>}
   */
  async deleteBookingExtraService(id) {
    const bookingExtraService = await BookingExtraService.findByPk(id);
    if (!bookingExtraService) {
      const err = new Error('Booking extra service not found'); err.statusCode = 404; throw err;
    }
    await bookingExtraService.destroy();
  }
}

module.exports = new BookingExtraServiceService();