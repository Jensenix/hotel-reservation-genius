import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingData } from '@/hooks/booking/useBookingData';
import { bookingPaymentService } from '@/services/bookingPaymentService';
import { calculateRoomTotal, calculateExtraServicesTotal } from '@/utils/bookingPrice';

export const useBookingProcess = (roomId, locationState, user) => {
  const navigate = useNavigate();
  const initialBookingId = locationState?.bookingId || null;

  const {
    room,
    paymentMethods,
    extraServices,
    loading,
    setLoading,
    bookingData,
    setBookingData,
  } = useBookingData(roomId, initialBookingId);

  const [bookingId, setBookingId] = useState(initialBookingId);
  const [step, setStep] = useState(initialBookingId ? 2 : 1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const [selectedExtraServices, setSelectedExtraServices] = useState({});

  const totalPrice = useMemo(() => 
    calculateRoomTotal(bookingData.checkInDate, bookingData.checkOutDate, room?.basePrice),
  [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const extraServicesTotal = useMemo(() => 
    calculateExtraServicesTotal(selectedExtraServices, extraServices),
  [selectedExtraServices, extraServices]);

  const grandTotal = totalPrice + extraServicesTotal;

  const handleNextStep = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setErrorState({ show: true, message: 'Please select valid check-in and check-out dates.' });
      return;
    }

    try {
      setLoading(true);
      setErrorState({ show: false, message: '' });

      const data = await bookingPaymentService.createBooking({
        userId: user?.id,
        roomTypeId: parseInt(roomId, 10),
        checkInDate: bookingData.checkInDate.toISOString(),
        checkOutDate: bookingData.checkOutDate.toISOString(),
        specialRequests: bookingData.specialRequests,
        totalPrice: totalPrice,
      });

      setBookingId(data.id);
      setStep(2);
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || error.message || 'Failed to create booking.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!bookingData.paymentMethodId) {
      setErrorState({ show: true, message: 'Please select a payment method.' });
      return;
    }

    try {
      setIsProcessingPayment(true);
      setErrorState({ show: false, message: '' });

      const paymentData = await bookingPaymentService.processPayment({
        bookingId,
        paymentMethodId: bookingData.paymentMethodId,
        grandTotal,
        selectedExtraServices,
        extraServices,
      });

      navigate('/booking-success', {
        state: { booking: paymentData.booking, room },
      });
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || error.message || 'Failed to process payment.',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    state: {
      room,
      loading,
      step,
      bookingData,
      paymentMethods,
      extraServices,
      selectedExtraServices,
      totalPrice,
      extraServicesTotal,
      grandTotal,
      bookingId,
      isProcessingPayment,
      errorState,
    },
    setBookingData,
    setSelectedExtraServices,
    setStep,
    setErrorState,
    handleNextStep,
    handleConfirmPayment,
  };
};