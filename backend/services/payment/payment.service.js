import db from '#models/index.js';
const { Payment, Booking, PaymentMethod } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/base.service.js';
import { publish, CHANNELS } from '../websocket/eventPublisher.js';

class PaymentService extends BaseService {
  constructor() {
    super(Payment, 'Payment');
  }

  /**
   * Creates a new payment and confirms the associated booking.
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

    let booking = await Booking.findByPk(bookingId);
    if (booking) {
      await booking.update({ status: 'confirmed' });
    }
    const updatedBooking = await Booking.findByPk(bookingId);

    try {
      const payload = { bookingId, paymentId: payment.id, status: 'paid' };
      if (updatedBooking && updatedBooking.userId) {
        await publish(CHANNELS.PAYMENT, { event: 'payment_updated', data: payload, room: `user:${updatedBooking.userId}` });
      }
      await publish(CHANNELS.PAYMENT, { event: 'payment_updated', data: payload, room: 'admin:dashboard' });
    } catch (err) {
      console.error('[PaymentService] Failed to publish payment_updated event:', err.message);
    }

    return { payment, booking: updatedBooking };
  }

  /**
   * Retrieves all payments with support for pagination and filtering.
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
   */
  async updatePayment(id, data) {
    return super.update(id, data);
  }

  /**
   * Deletes a payment record.
   */
  async deletePayment(id) {
    return super.delete(id);
  }
}

export default new PaymentService();