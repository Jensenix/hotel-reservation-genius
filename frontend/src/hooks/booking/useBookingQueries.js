import { useState, useEffect } from 'react';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

export const useBookingQueries = (roomId, initialBookingId) => {
  const [room, setRoom] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [existingBooking, setExistingBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const promises = [
          apiService.paymentMethods.getAll(),
          apiService.extraServices.getAll(),
        ];

        if (roomId) promises.push(apiService.roomTypes.getById(roomId));
        if (initialBookingId)
          promises.push(apiService.bookings.getById(initialBookingId));

        const [paymentRes, servicesRes, roomRes, bookingRes] =
          await Promise.all(promises);

        if (isMounted) {
          setPaymentMethods(paymentRes?.data?.data || []);
          setExtraServices(servicesRes?.data?.data || []);
          if (roomRes) setRoom(roomRes.data.data);
          if (bookingRes) setExistingBooking(bookingRes.data.data);
        }
      } catch (error) {
        logger.error('Error fetching booking initialization data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [roomId, initialBookingId]);

  return { room, paymentMethods, extraServices, existingBooking, loading };
};
