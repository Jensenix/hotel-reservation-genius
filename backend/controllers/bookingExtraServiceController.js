const { BookingExtraService, ExtraService, Booking } = require('../models');

// Create booking extra service
exports.createBookingExtraService = async (req, res) => {
  try {
    const { bookingId, extraServiceId, quantity, subtotal } = req.body;

    // Validate booking exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate extra service exists
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

// Get booking extra services by booking ID
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

// Delete booking extra service
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
