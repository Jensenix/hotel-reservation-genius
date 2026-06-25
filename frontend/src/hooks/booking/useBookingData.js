import { useState, useEffect } from 'react';
import apiService from '@/services/api/apiService';

export const useBookingData = (roomId, initialBookingId) => {
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestCount: 1,
    specialRequests: '',
    paymentMethodId: '',
  });

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      setLoading(true);
      try {
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

  return {
    room,
    paymentMethods,
    extraServices,
    loading,
    setLoading,
    bookingData,
    setBookingData,
  };
};