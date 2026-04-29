const { BookingExtraService, ExtraService, Booking } = require('../models');

/**
 * Assigns an extra service to a booking.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} JSON response with the created booking extra service.
 */
exports.createBookingExtraService = async (req, res) => {
  try {
    const { bookingId, extraServiceId, quantity, subtotal } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const extraService = await ExtraService.findByPk(extraServiceId);
    if (!extraService) {
      return res.status(404).json({ message: 'Extra service not found' });
    }

    const bookingExtraService = await BookingExtraService.create({
      bookingId,
      extraServiceId,
      quantity,
      subtotal
    });

    res.status(201).json({
      success: true,
      data: bookingExtraService
    });
  } catch (error) {
    console.error('Error creating booking extra service:', error);
    res.status(500).json({ message: 'Failed to create booking extra service', error: error.message });
  }
};

/**
 * Retrieves all extra services associated with a specific booking ID.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} JSON response containing the list of booking extra services.
 */
exports.getBookingExtraServicesByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingExtraServices = await BookingExtraService.findAll({
      where: { bookingId },
      include: [{
        model: ExtraService,
        as: 'extraService'
      }]
    });

    res.status(200).json({
      success: true,
      data: bookingExtraServices
    });
  } catch (error) {
    console.error('Error fetching booking extra services:', error);
    res.status(500).json({ message: 'Failed to fetch booking extra services', error: error.message });
  }
};

/**
 * Deletes an extra service tied to a booking.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} JSON response confirming deletion.
 */
exports.deleteBookingExtraService = async (req, res) => {
  try {
    const { id } = req.params;

    const bookingExtraService = await BookingExtraService.findByPk(id);
    if (!bookingExtraService) {
      return res.status(404).json({ message: 'Booking extra service not found' });
    }

    await bookingExtraService.destroy();

    res.status(200).json({
      success: true,
      message: 'Booking extra service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking extra service:', error);
    res.status(500).json({ message: 'Failed to delete booking extra service', error: error.message });
  }
};