import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingData } from '@/hooks/booking/useBookingData';
import { bookingPaymentService } from '@/services/bookingPaymentService';
import { bookingExtraServiceAPI } from '@/services/endpoints/booking.service';
import { calculateRoomTotal, calculateExtraServicesTotal } from '@/utils/bookingPrice';
import apiService from '@/services/api/apiService';
import { MaxStayDays } from '@/config';

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
  const [step, setStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });
  const [selectedExtraServices, setSelectedExtraServices] = useState({});

  // BUG FIX: When resuming a pending booking (bookingId came from
  // location.state instead of being created in this session),
  // selectedExtraServices used to start empty with nothing to rehydrate it.
  // handleNextStep would then send extraServices: [] on the very next
  // "Continue" click, and the backend's _applyExtraServices() does a
  // destroy-then-recreate against whatever array it receives — so an empty
  // array wipes out the extras (and totalPrice) that were already saved.
  // Prefilling from the server here makes the payload we send back an
  // accurate reflection of what's actually attached to the booking.
  useEffect(() => {
    if (!initialBookingId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await bookingExtraServiceAPI.getByBookingId(initialBookingId);
        const rows = res.data?.data || [];
        const prefilled = {};
        rows.forEach((row) => {
          prefilled[row.extraServiceId] = row.quantity;
        });
        if (!cancelled) {
          setSelectedExtraServices(prefilled);
        }
      } catch (err) {
        console.error(
          `Failed to load existing extra services for booking ${initialBookingId}:`,
          err,
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialBookingId]);

  // Room-only price
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

    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const diffDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      setErrorState({ show: true, message: 'Check-out date must be after check-in date.' });
      return;
    }

    if (diffDays > MaxStayDays) {
      const trimmedCheckOut = new Date(checkIn.getTime() + (MaxStayDays * 24 * 60 * 60 * 1000));
      setBookingData((prev) => ({ ...prev, checkOutDate: trimmedCheckOut }));
      setErrorState({
        show: true,
        message: `Stays are limited to ${MaxStayDays} days. Your dates have been automatically adjusted. Please review the new price and click Continue again.`,
      });
      return;
    }

    const formattedExtraServices = Object.entries(selectedExtraServices)
      .filter(([_, quantity]) => quantity > 0)
      .map(([serviceId, quantity]) => ({
        extraServiceId: parseInt(serviceId, 10),
        quantity
      }));

    try {
      setLoading(true);
      setErrorState({ show: false, message: '' });

      if (bookingId) {
        await apiService.bookings.update(bookingId, {
          checkInDate: bookingData.checkInDate.toISOString(),
          checkOutDate: bookingData.checkOutDate.toISOString(),
          specialRequests: bookingData.specialRequests,
          // 👉 FIX: Reverted to room-only price. Backend will add the extras safely!
          totalPrice: totalPrice, 
          extraServices: formattedExtraServices,
          // selectedExtraServices is now prefilled from the server on resume
          // (see the effect above), so an empty array here genuinely means
          // "the user removed every extra." Tell the backend that explicitly
          // so its safety guard still allows the intentional clear.
          clearExtraServices: formattedExtraServices.length === 0,
        });
        setStep(2);
      } else {
        const data = await bookingPaymentService.createBooking({
          userId: user?.id,
          roomTypeId: parseInt(roomId, 10),
          checkInDate: bookingData.checkInDate.toISOString(),
          checkOutDate: bookingData.checkOutDate.toISOString(),
          specialRequests: bookingData.specialRequests,
          // 👉 FIX: Reverted to room-only price. Backend will add the extras safely!
          totalPrice: totalPrice, 
          extraServices: formattedExtraServices, 
        });

        setBookingId(data.id);
        setStep(2);
      }
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || error.message || 'Failed to process booking.',
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
        // grandTotal is passed here purely to advise the payment record
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