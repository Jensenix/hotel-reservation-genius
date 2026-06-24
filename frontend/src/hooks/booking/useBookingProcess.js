import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/apiService';

export const useBookingProcess = (roomId, locationState, user) => {
  const navigate = useNavigate();
  const initialBookingId = locationState?.bookingId || null;

  // --- 1. State Management ---
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [step, setStep] = useState(initialBookingId ? 2 : 1);
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: '',
  });

  const [selectedExtraServices, setSelectedExtraServices] = useState({});

  // --- 2. Derived Calculations ---
  const totalPrice = useMemo(() => {
    if (bookingData.checkInDate && bookingData.checkOutDate && room) {
      const nights = Math.ceil(
        (bookingData.checkOutDate - bookingData.checkInDate) / (1000 * 60 * 60 * 24)
      );
      return nights > 0 ? nights * room.basePrice : 0;
    }
    return 0;
  }, [bookingData.checkInDate, bookingData.checkOutDate, room]);

  const extraServicesTotal = useMemo(() => {
    return Object.entries(selectedExtraServices).reduce((total, [id, qty]) => {
      const svc = extraServices.find((s) => s.id === parseInt(id, 10));
      return total + (svc ? svc.price * qty : 0);
    }, 0);
  }, [selectedExtraServices, extraServices]);

  const grandTotal = totalPrice + extraServicesTotal;

  // --- 3. Initial Data Fetching ---
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      setLoading(true);
      try {
        // Fetch base requirements
        const [pmRes, esRes, roomRes] = await Promise.all([
          apiService.paymentMethods.getAll(),
          apiService.extraServices.getAll(),
          roomId ? apiService.roomTypes.getById(roomId) : Promise.resolve({ data: { data: null } }),
        ]);

        if (isMounted) {
          setPaymentMethods(pmRes.data.data || []);
          setExtraServices(esRes.data.data || []);
          setRoom(roomRes.data.data || null);
        }

        // Fetch existing booking if modifying
        if (initialBookingId) {
          const bRes = await apiService.bookings.getById(initialBookingId);
          if (isMounted && bRes.data.data) {
            const existing = bRes.data.data;
            setBookingData((prev) => ({
              ...prev,
              checkInDate: existing.checkInDate ? new Date(existing.checkInDate) : null,
              checkOutDate: existing.checkOutDate ? new Date(existing.checkOutDate) : null,
              guestCount: existing.room?.maxCapacity || prev.guestCount,
              specialRequests: existing.specialRequests || '',
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching booking requirements:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [roomId, initialBookingId]);

  // --- 4. Action Handlers ---
  const handleNextStep = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setErrorState({ show: true, message: 'Please select valid check-in and check-out dates.' });
      return;
    }

    try {
      setLoading(true);
      setErrorState({ show: false, message: '' });

      const res = await apiService.bookings.create({
        userId: user?.id,
        roomTypeId: parseInt(roomId, 10),
        checkInDate: bookingData.checkInDate.toISOString(),
        checkOutDate: bookingData.checkOutDate.toISOString(),
        specialRequests: bookingData.specialRequests,
        totalPrice: totalPrice,
      });

      if (res.data.success) {
        setBookingId(res.data.data.id);
        setStep(2);
      } else {
        throw new Error('Failed to create booking.');
      }
    } catch (error) {
      setErrorState({
        show: true,
        message: error.response?.data?.message || 'Failed to create booking.',
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

      // Process Extra Services
      for (const [serviceId, quantity] of Object.entries(selectedExtraServices)) {
        if (quantity > 0) {
          const service = extraServices.find((s) => s.id === parseInt(serviceId, 10));
          if (service) {
            await apiService.bookingExtraServices.create({
              bookingId,
              extraServiceId: parseInt(serviceId, 10),
              quantity,
              subtotal: service.price * quantity,
            });
          }
        }
      }

      // Process Final Payment
      const paymentRes = await apiService.payments.create({
        bookingId,
        paymentMethodId: parseInt(bookingData.paymentMethodId, 10),
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
      setIsProcessingPayment(false);
    }
  };

  // --- 5. Strict Return Signature ---
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