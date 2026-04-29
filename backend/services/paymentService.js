const { Payment, Booking, PaymentMethod } = require('../models');
const pagination = require('../utils/pagination');

class PaymentService {
  /**
   * Creates a payment.
   * @param {Object} data - Payment data.
   * @returns {Promise<Object>} Payment and booking info.
   */
  async createPayment({ bookingId, paymentMethodId, amount, paymentStatus, transactionTime }) {
    if (!bookingId || !amount) {
      const err = new Error('bookingId and amount are required'); err.statusCode = 400; throw err;
    }
    if (paymentMethodId) {
      const method = await PaymentMethod.findByPk(paymentMethodId);
      if (!method) { const err = new Error('Invalid payment method'); err.statusCode = 400; throw err; }
    }

    const payment = await Payment.create({ bookingId, paymentMethodId, amount, paymentStatus: paymentStatus || 'paid', transactionTime: transactionTime || new Date() });
    const booking = await Booking.findByPk(bookingId);
    if (booking) await booking.update({ status: 'confirmed' });
    return { payment, booking: await Booking.findByPk(bookingId) };
  }

  /**
   * Retrieves payments.
   * @param {Object} query - Query params.
   * @returns {Promise<Object>} Paginated payments.
   */
  async getAllPayments({ page = 1, limit, paymentStatus, bookingId }) {
    const where = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (bookingId) where.bookingId = bookingId;

    const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);
    const { count, rows } = await Payment.findAndCountAll({
      where, offset, limit: parsedLimit, order: [['createdAt', 'DESC']],
      include: [{ model: Booking, as: 'booking', include: ['user', 'room'] }, { model: PaymentMethod, as: 'paymentMethod' }]
    });

    return { rows, pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit) };
  }

  /**
   * Retrieves a payment by ID.
   * @param {string|number} id - Payment ID.
   * @returns {Promise<Object>} Payment data.
   */
  async getPaymentById(id) {
    const payment = await Payment.findByPk(id, { include: [{ model: Booking, as: 'booking', include: ['user', 'room'] }, { model: PaymentMethod, as: 'paymentMethod' }] });
    if (!payment) { const err = new Error('Payment not found'); err.statusCode = 404; throw err; }
    return payment;
  }

  /**
   * Updates a payment.
   * @param {string|number} id - Payment ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated payment.
   */
  async updatePayment(id, data) {
    const payment = await Payment.findByPk(id);
    if (!payment) { const err = new Error('Payment not found'); err.statusCode = 404; throw err; }
    return payment.update(data);
  }

  /**
   * Deletes a payment.
   * @param {string|number} id - Payment ID.
   * @returns {Promise<void>}
   */
  async deletePayment(id) {
    const payment = await Payment.findByPk(id);
    if (!payment) { const err = new Error('Payment not found'); err.statusCode = 404; throw err; }
    await payment.destroy();
  }
}

module.exports = new PaymentService();