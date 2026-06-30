import apiService from '@/services/api/apiService';

export const bookingPaymentService = {
  /**
   * Initializes the base booking record. `payload.extraServices`, if
   * present, is forwarded as-is and persisted server-side immediately
   * (see booking.service.js#createBooking) so a pending booking remembers
   * its extras even if the user leaves before paying.
   */
  async createBooking(payload) {
    const res = await apiService.bookings.create(payload);
    
    if (!res.data.success) {
      throw new Error('Failed to create booking.');
    }
    
    return res.data.data;
  },

  /**
   * Confirms payment for an already-fully-persisted booking.
   *
   * FIX (root cause): this used to also create bookingExtraServices rows
   * from `selectedExtraServices` and overwrite booking.totalPrice from
   * client state. That's exactly what caused resumed bookings to lose
   * their extras: after a reload, selectedExtraServices was empty, so this
   * call created no extras and wrote a room-only total. Extras are now
   * persisted earlier, in useBookingProcess's handleNextStep, exactly once
   * — doing it again here would also risk duplicate
   * bookingExtraServices rows. The server is the source of truth for the
   * amount actually charged (see payment.service.js#createPayment).
   */
  async processPayment({ bookingId, paymentMethodId, grandTotal }) {
    const paymentRes = await apiService.payments.create({
      bookingId,
      paymentMethodId: parseInt(paymentMethodId, 10),
      amount: grandTotal, // advisory only — server charges booking.totalPrice
      paymentStatus: 'paid',
      transactionTime: new Date().toISOString(),
    });

    if (!paymentRes.data.success) {
      throw new Error('Payment processing failed');
    }

    return paymentRes.data.data;
  }
};