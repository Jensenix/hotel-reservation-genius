const { Payment, Booking, PaymentMethod } = require('../models');
const pagination = require('../utils/pagination');

class PaymentController {
  // Create new payment
  async createPayment(req, res) {
    try {
      const { bookingId, paymentMethodId, amount, paymentStatus, transactionTime } = req.body;

      // Manual validation
      if (!bookingId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'bookingId and amount are required'
        });
      }

      const payment = await Payment.create({
        bookingId,
        paymentMethodId,
        amount,
        paymentStatus: paymentStatus || 'pending',
        transactionTime
      });

      return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
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

  // Get all payments with pagination and filtering
  async getAllPayments(req, res) {
    try {
      const { page = 1, limit = 10, paymentStatus, bookingId } = req.query;

      const where = {};

      // Filter by status
      if (paymentStatus) {
        where.paymentStatus = paymentStatus;
      }

      // Filter by booking
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

  // Get payment by ID
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

  // Update payment
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

  // Delete payment
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
