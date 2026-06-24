import { useState, useMemo } from 'react';
import { useBookingQueries } from './useBookingQueries';
import { useBookingMutations } from './useBookingMutations';
import { calculateRoomPrice, calculateExtraServicesTotal } from '@/utils/bookingCalculations';

export const useBookingProcess = (roomId, locationState, user) => {
  const initialBookingId = locationState?.bookingId || null;
  
  const { room, paymentMethods, extraServices, existingBooking, loading } = useBookingQueries(roomId, initialBookingId);
  
  const { createBooking, processPayment, isProcessing, errorState, setErrorState } = useBookingMutations();

  const [bookingId, setBookingId] = useState(initialBookingId);
  const [step, setStep] = useState(initialBookingId ? 2 : 1);
  const [selectedExtraServices, setSelectedExtraServices] = useState({});
  
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: '',
  });

  // --- THE FIX: Track previous data to update state during render ---
  const [prevExistingBooking, setPrevExistingBooking] = useState(null);

  if (existingBooking && existingBooking !== prevExistingBooking) {
    // 1. Update the tracking state to prevent infinite loops
    setPrevExistingBooking(existingBooking);
    
    // 2. Update your form state immediately
    setBookingData((prev) => ({
      ...prev,
      checkInDate: existingBooking.checkInDate ? new Date(existingBooking.checkInDate) : null,
      checkOutDate: existingBooking.checkOutDate ? new Date(existingBooking.checkOutDate) : null,
      guestCount: existingBooking.room?.maxCapacity || prev.guestCount,
      specialRequests: existingBooking.specialRequests || '',
    }));
  }
  // ------------------------------------------------------------------

  const totalPrice = useMemo(() => 
    calculateRoomPrice(bookingData.checkInDate, bookingData.checkOutDate, room?.basePrice), 
  [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const extraServicesTotal = useMemo(() => 
    calculateExtraServicesTotal(selectedExtraServices, extraServices), 
  [selectedExtraServices, extraServices]);

  const grandTotal = useMemo(() => totalPrice + extraServicesTotal, [totalPrice, extraServicesTotal]);

  const handleNextStep = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setErrorState({ show: true, message: 'Please select valid check-in and check-out dates.' });
      return;
    }

    const newBookingId = await createBooking({
      userId: user?.id,
      roomTypeId: parseInt(roomId, 10),
      checkInDate: bookingData.checkInDate.toISOString(),
      checkOutDate: bookingData.checkOutDate.toISOString(),
      specialRequests: bookingData.specialRequests,
      totalPrice: totalPrice,
    });

    if (newBookingId) {
      setBookingId(newBookingId);
      setStep(2);
    }
  };

  const handleConfirmPayment = async () => {
    if (!bookingData.paymentMethodId) {
      setErrorState({ show: true, message: 'Please select a payment method.' });
      return;
    }

    await processPayment({
      bookingId,
      paymentMethodId: bookingData.paymentMethodId,
      grandTotal,
      selectedExtraServices,
      extraServices,
      room,
    });
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
      isProcessingPayment: isProcessing,
      errorState,
      bookingId,
    },
    setBookingData,
    setSelectedExtraServices,
    setStep,
    setErrorState,
    handleNextStep,
    handleConfirmPayment,
  };
};