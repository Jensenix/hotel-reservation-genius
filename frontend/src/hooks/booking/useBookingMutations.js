import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/api/apiService';

export const useBookingMutations = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  const createBooking = async (bookingPayload) => {
    setIsProcessing(true);
    setErrorState({ show: false, message: '' });

    try {
      const res = await apiService.bookings.create(bookingPayload);
      if (res.data.success) {
        return res.data.data.id;
      }
      throw new Error('Failed to create booking.');
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || 'Failed to create booking.',
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async ({
    bookingId,
    paymentMethodId,
    grandTotal,
    selectedExtraServices,
    extraServices,
    room,
  }) => {
    setIsProcessing(true);
    setErrorState({ show: false, message: '' });

    try {
      const servicePromises = Object.entries(selectedExtraServices)
        .filter(([_, quantity]) => quantity > 0)
        .map(([serviceId, quantity]) => {
          const service = extraServices.find(
            (s) => s.id === parseInt(serviceId, 10),
          );
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

      if (paymentRes.data.success) {
        navigate('/booking-success', {
          state: { booking: paymentRes.data.data.booking, room },
        });
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || 'Failed to process payment.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createBooking,
    processPayment,
    isProcessing,
    errorState,
    setErrorState,
  };
};
