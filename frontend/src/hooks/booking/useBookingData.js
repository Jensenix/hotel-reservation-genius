import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '@/services/api/apiService';

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export const useBookingData = (roomId, initialBookingId) => {
  const [searchParams] = useSearchParams();
  
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    checkInDate: parseLocalDate(searchParams.get('checkIn')),
    checkOutDate: parseLocalDate(searchParams.get('checkOut')),
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
              checkInDate: existing.checkInDate ? new Date(existing.checkInDate) : prev.checkInDate,
              checkOutDate: existing.checkOutDate ? new Date(existing.checkOutDate) : prev.checkOutDate,
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