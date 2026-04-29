const { Payment, Booking, PaymentMethod } = require('../models');
const pagination = require('../utils/pagination');

class PaymentController {
  /**
   * Creates a new payment and updates corresponding booking status.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing payment and updated booking data.
   */
  async createPayment(req, res) {
    try {
      const { bookingId, paymentMethodId, amount, paymentStatus, transactionTime } = req.body;

      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'bookingId and amount are required'
        });
      }

      if (paymentMethodId) {
        const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
        if (!paymentMethod) {
          return res.status(400).json({
            success: false,
            message: 'Invalid payment method'
          });
        }
      }

      const payment = await Payment.create({
        bookingId,
        paymentMethodId,
        amount,
        paymentStatus: paymentStatus || 'paid',
        transactionTime: transactionTime || new Date()
      });

      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        await booking.update({ status: 'confirmed' });
      }

      const updatedBooking = await Booking.findByPk(bookingId);

      return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: {
          payment,
          booking: updatedBooking
        }
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating payment',
        error: error.message
      });
    }
  }

  /**
   * Retrieves all payments with support for pagination and filtering.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the list of payments and pagination details.
   */
  async getAllPayments(req, res) {
    try {
      const { page = 1, limit, paymentStatus, bookingId } = req.query;

      const where = {};

      if (paymentStatus) {
        where.paymentStatus = paymentStatus;
      }

      if (bookingId) {
        where.bookingId = bookingId;
      }

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await Payment.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Booking,
            as: 'booking',
            include: ['user', 'room']
          },
          {
            model: PaymentMethod,
            as: 'paymentMethod'
          }
        ]
      });

      return res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit)
      });
    } catch (error) {
      console.error('Error getting payments:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting payments',
        error: error.message
      });
    }
  }

  /**
   * Retrieves a specific payment by ID.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the payment data.
   */
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id, {
        include: [
          {
            model: Booking,
            as: 'booking',
            include: ['user', 'room']
          },
          {
            model: PaymentMethod,
            as: 'paymentMethod'
          }
        ]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error getting payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting payment',
        error: error.message
      });
    }
  }

  /**
   * Updates payment record details.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated payment details.
   */
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { bookingId, paymentMethodId, amount, paymentStatus, transactionTime } = req.body;

      const payment = await Payment.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      await payment.update({
        bookingId: bookingId || payment.bookingId,
        paymentMethodId: paymentMethodId || payment.paymentMethodId,
        amount: amount || payment.amount,
        paymentStatus: paymentStatus || payment.paymentStatus,
        transactionTime: transactionTime || payment.transactionTime
      });

      return res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating payment',
        error: error.message
      });
    }
  }

  /**
   * Deletes a payment record.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming deletion.
   */
  async deletePayment(req, res) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      await payment.destroy();

      return res.status(200).json({
        success: true,
        message: 'Payment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting payment',
        error: error.message
      });
    }
  }
}

module.exports = new PaymentController();