import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/apiService';

export const useBookingProcess = (roomId, locationState, user) => {
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: '',
  });
  
  const [selectedExtraServices, setSelectedExtraServices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [extraServicesTotal, setExtraServicesTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorState, setErrorState] = useState({ show: false, message: '' });

  // 1. Initial Data Fetch
  useEffect(() => {
    if (roomId) fetchRoomDetails();
    fetchPaymentMethods();
    fetchExtraServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 2. Resume Pending Booking
  useEffect(() => {
    if (locationState?.bookingId) {
      setBookingId(locationState.bookingId);
      setStep(2);
      fetchBookingDetails(locationState.bookingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  // 3. Price Calculations
  useEffect(() => {
    if (bookingData.checkInDate && bookingData.checkOutDate && room) {
      const nights = Math.ceil((bookingData.checkOutDate - bookingData.checkInDate) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights * room.basePrice);
    }
  }, [bookingData.checkInDate, bookingData.checkOutDate, room]);

  useEffect(() => {
    let total = 0;
    Object.entries(selectedExtraServices).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = extraServices.find((s) => s.id === parseInt(serviceId));
        if (service) total += service.price * quantity;
      }
    });
    setExtraServicesTotal(total);
    setGrandTotal(totalPrice + total);
  }, [selectedExtraServices, extraServices, totalPrice]);

  // API Call Helpers
  const fetchRoomDetails = async () => {
    try {
      const response = await apiService.roomTypes.getById(roomId);
      const roomType = response.data.data;
      setRoom({ ...roomType, id: roomType.id, roomTypeId: roomType.id });
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await apiService.paymentMethods.getAll();
      setPaymentMethods(response.data.data);
    } catch (error) {}
  };

  const fetchExtraServices = async () => {
    try {
      const response = await apiService.extraServices.getAll();
      setExtraServices(response.data.data);
    } catch (error) {}
  };

  const fetchBookingDetails = async (id) => {
    try {
      const response = await apiService.bookings.getById(id);
      const booking = response.data.data;
      setBookingData((prev) => ({
        ...prev,
        checkInDate: new Date(booking.checkInDate),
        checkOutDate: new Date(booking.checkOutDate),
        guestCount: booking.guestCount || 1,
        specialRequests: booking.specialRequests || '',
      }));
      
      if (booking.extraServices?.length > 0) {
        const servicesMap = {};
        booking.extraServices.forEach((service) => {
          servicesMap[service.id] = service.BookingExtraService?.quantity || 1;
        });
        setSelectedExtraServices(servicesMap);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  // Handlers
  const handleNextStep = async () => {
    if (step === 1) {
      if (bookingId) return setStep(2);
      
      try {
        setIsProcessingPayment(true);
        const payload = {
          userId: user?.id,
          roomTypeId: room?.roomTypeId,
          checkInDate: bookingData.checkInDate.toLocaleDateString('en-CA'),
          checkOutDate: bookingData.checkOutDate.toLocaleDateString('en-CA'),
          totalPrice: grandTotal,
          status: 'pending',
        };
        const res = await apiService.bookings.create(payload);
        setBookingId(res.data.data.id);
        setStep(2);
      } catch (error) {
        setErrorState({ show: true, message: 'Failed to create booking. Please try again.' });
      } finally {
        setIsProcessingPayment(false);
      }
    } else if (step === 2) {
      await processPayment();
    }
  };

  const processPayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Submit extra services
      for (const [serviceId, quantity] of Object.entries(selectedExtraServices)) {
        if (quantity > 0) {
          const service = extraServices.find((s) => s.id === parseInt(serviceId));
          await apiService.bookingExtraServices.create({
            bookingId,
            extraServiceId: parseInt(serviceId),
            quantity,
            subtotal: service.price * quantity,
          });
        }
      }

      // Submit payment
      const paymentRes = await apiService.payments.create({
        bookingId,
        paymentMethodId: parseInt(bookingData.paymentMethodId),
        amount: grandTotal,
        paymentStatus: 'paid',
        transactionTime: new Date().toISOString(),
      });

      if (paymentRes.data.success) {
        navigate('/booking-success', { state: { booking: paymentRes.data.data.booking, room } });
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      setErrorState({ 
        show: true, 
        message: error.response?.data?.message || 'Failed to create booking.' 
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    state: { room, loading, step, bookingData, paymentMethods, extraServices, selectedExtraServices, totalPrice, extraServicesTotal, grandTotal, isProcessingPayment, errorState, bookingId },
    actions: { setBookingData, setSelectedExtraServices, setStep, handleNextStep, setErrorState }
  };
};