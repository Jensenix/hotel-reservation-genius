import apiService from '@/services/api/apiService';

export const bookingPaymentService = {
  /**
   * Initializes the base booking record.
   */
  async createBooking(payload) {
    const res = await apiService.bookings.create(payload);
    
    if (!res.data.success) {
      throw new Error('Failed to create booking.');
    }
    
    return res.data.data;
  },

  /**
   * Processes extra services and confirms final payment in sequence.
   */
  async processPayment({ bookingId, paymentMethodId, grandTotal, selectedExtraServices, extraServices }) {
    const servicePromises = Object.entries(selectedExtraServices)
      .filter(([_, quantity]) => quantity > 0)
      .map(([serviceId, quantity]) => {
        const service = extraServices.find((s) => s.id === parseInt(serviceId, 10));
        
        if (service) {
          return apiService.bookingExtraServices.create({
            bookingId,
            extraServiceId: parseInt(serviceId, 10),
            quantity,
            subtotal: service.price * quantity,
          });
        }
        return Promise.resolve();
      });

    await Promise.all(servicePromises);

    const paymentRes = await apiService.payments.create({
      bookingId,
      paymentMethodId: parseInt(paymentMethodId, 10),
      amount: grandTotal,
      paymentStatus: 'paid',
      transactionTime: new Date().toISOString(),
    });

    if (!paymentRes.data.success) {
      throw new Error('Payment processing failed');
    }

    return paymentRes.data.data;
  }
};