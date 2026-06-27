import db from '#models/index.js';
const { Payment, Booking, PaymentMethod } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/base.service.js';

class PaymentService extends BaseService {
  constructor() {
    super(Payment, 'Payment');
  }

  /**
   * Creates a new payment and confirms the associated booking.
   * @param {Object} data - Payment data.
   * @param {string|number} data.bookingId - The ID of the booking being paid for.
   * @param {string|number} [data.paymentMethodId] - The ID of the payment method used.
   * @param {number} data.amount - The amount paid.
   * @param {string} [data.paymentStatus] - The status of the payment (defaults to 'paid').
   * @param {Date|string} [data.transactionTime] - The time the transaction occurred.
   * @returns {Promise<Object>} An object containing the created payment and the updated booking.
   * @throws {Error} If bookingId/amount are missing, or if the payment method is invalid.
   */
  async createPayment({
    bookingId,
    paymentMethodId,
    amount,
    paymentStatus,
    transactionTime,
  }) {
    if (!bookingId || !amount) {
      const err = new Error('bookingId and amount are required');
      err.statusCode = 400;
      throw err;
    }

    if (paymentMethodId) {
      const method = await PaymentMethod.findByPk(paymentMethodId);
      if (!method) {
        const err = new Error('Invalid payment method');
        err.statusCode = 400;
        throw err;
      }
    }

    const payment = await super.create({
      bookingId,
      paymentMethodId,
      amount,
      paymentStatus: paymentStatus || 'paid',
      transactionTime: transactionTime || new Date(),
    });

    const booking = await Booking.findByPk(bookingId);
    if (booking) {
      await booking.update({ status: 'confirmed' });
    }

    return { payment, booking: await Booking.findByPk(bookingId) };
  }

  /**
   * Retrieves all payments with support for pagination and filtering.
   * @param {Object} query - The query parameters.
   * @param {number} [query.page=1] - The page number.
   * @param {number} [query.limit] - The number of records per page.
   * @param {string} [query.paymentStatus] - Filter by payment status.
   * @param {string|number} [query.bookingId] - Filter by a specific booking ID.
   * @returns {Promise<Object>} An object containing the rows and pagination details.
   */
  async getAllPayments({ page = 1, limit, paymentStatus, bookingId }) {
    const where = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (bookingId) where.bookingId = bookingId;

    const { offset, limit: parsedLimit } = pagination.getPagination(
      page,
      limit,
    );
    const { count, rows } = await super.getAll({
      where,
      offset,
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Booking, as: 'booking', include: ['user', 'room'] },
        { model: PaymentMethod, as: 'paymentMethod' },
      ],
    });

    return {
      rows,
      pagination: pagination.getPagingData(
        { count, rows },
        parseInt(page),
        parsedLimit,
      ),
    };
  }

  /**
   * Retrieves a specific payment by ID.
   * @param {string|number} id - The ID of the payment.
   * @returns {Promise<Object>} The payment data with associated booking and payment method.
   * @throws {Error} If the payment is not found.
   */
  async getPaymentById(id) {
    return super.getById(id, {
      include: [
        { model: Booking, as: 'booking', include: ['user', 'room'] },
        { model: PaymentMethod, as: 'paymentMethod' },
      ],
    });
  }

  /**
   * Updates an existing payment record.
   * @param {string|number} id - The ID of the payment to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} The updated payment record.
   * @throws {Error} If the payment is not found.
   */
  async updatePayment(id, data) {
    return super.update(id, data);
  }

  /**
   * Deletes a payment record.
   * @param {string|number} id - The ID of the payment to delete.
   * @returns {Promise<void>}
   * @throws {Error} If the payment is not found.
   */
  async deletePayment(id) {
    return super.delete(id);
  }
}

export default new PaymentService();
