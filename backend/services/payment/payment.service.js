import db from '#models/index.js';
const { Payment, Booking, PaymentMethod } = db;
import pagination from '#utils/pagination.js';
import BaseService from '../base/base.service.js';
import { publish, CHANNELS } from '../websocket/eventPublisher.js';
import { RealtimeEvents } from '../../shared/eventContract.js';

class PaymentService extends BaseService {
  constructor() {
    super(Payment, 'Payment');
  }

  /**
   * Creates a new payment and confirms the associated booking.
   *
   * FIX (financial bug): the amount charged now always comes from the
   * booking's persisted totalPrice (kept correct by booking.service.js,
   * which syncs extra services as soon as Step 1 is confirmed) rather than
   * a client-supplied `amount`. This closes the gap where a resumed
   * booking's React state could be empty/stale and a wrong amount would
   * have been charged regardless of what the server actually had on file.
   *
   * NOTE: this intentionally removes the ability for a caller to charge an
   * arbitrary `amount` for a given booking. If an admin-side "manual
   * correction" payment flow needs that, add an explicit, separately
   * authorized path rather than relaxing this check.
   */
  async createPayment({
    bookingId,
    paymentMethodId,
    amount,
    paymentStatus,
    transactionTime,
  }) {
    if (!bookingId) {
      const err = new Error('bookingId is required');
      err.statusCode = 400;
      throw err;
    }

    const existingBooking = await Booking.findByPk(bookingId);
    if (!existingBooking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
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

    const authoritativeAmount = Number(existingBooking.totalPrice);

    if (amount != null && Number(amount) !== authoritativeAmount) {
      console.warn(
        `[PaymentService] Client-sent amount (${amount}) did not match persisted booking total (${authoritativeAmount}) for booking ${bookingId}. Charging the persisted total.`,
      );
    }

    const payment = await super.create({
      bookingId,
      paymentMethodId,
      amount: authoritativeAmount,
      paymentStatus: paymentStatus || 'paid',
      transactionTime: transactionTime || new Date(),
    });

    await existingBooking.update({ status: 'confirmed' });
    const updatedBooking = await Booking.findByPk(bookingId);

    try {
      const targetRooms = ['admin:dashboard'];
      if (updatedBooking && updatedBooking.userId) {
        targetRooms.push(`user:${updatedBooking.userId}`);
      }

      await publish(CHANNELS.PAYMENT, {
        event: RealtimeEvents.PAYMENT.UPDATED,
        data: { bookingId, paymentId: payment.id, status: 'paid' },
        rooms: targetRooms,
      });
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