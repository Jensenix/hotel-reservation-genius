import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { getCheckOutBlockedReason } from '@/utils/bookingActionUtils';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RealtimeEvents } from '@/shared/eventContract.js';
import { logger } from '@/config';

/**
 * @returns {{
 *   booking: Object|null,
 *   loading: boolean,
 *   goBack: Function,
 *   goToModify: Function,
 *   handleContinuePayment: Function,
 *   handleCheckIn: Function,
 *   handleCheckOut: Function,
 *   handleCancel: Function
 * }}
 */
export const useBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useWebSocket(RealtimeEvents.BOOKING.STATUS_CHANGED, (payload) => {
    if (!payload || !payload.bookingId || !payload.status) return;

    setBooking((prevBooking) => {
      if (prevBooking && String(prevBooking.id) === String(payload.bookingId)) {
        return { ...prevBooking, status: payload.status };
      }
      return prevBooking;
    });
  });

  useEffect(() => {
    let isMounted = true;

    const fetchBookingDetail = async () => {
      try {
        const response = await apiService.bookings.getById(id);
        if (isMounted) {
          setBooking(response.data.data);
        }
      } catch (error) {
        logger.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchBookingDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const goBack = () => navigate('/my-bookings');

  const goToModify = (roomId) => navigate(`/booking/${roomId}`);

  const handleContinuePayment = (roomTypeId, bookingId) => {
    navigate(`/booking/${roomTypeId}`, { state: { bookingId } });
  };

  const handleCheckIn = async () => {
    try {
      await apiService.bookings.selfCheckIn(id);
    } catch (error) {
      logger.error(error);
      alert(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;

    const blockedReason = getCheckOutBlockedReason(booking);
    if (blockedReason) {
      alert(blockedReason);
      return;
    }

    try {
      await apiService.bookings.selfCheckOut(id);
    } catch (error) {
      logger.error(error);
      alert(error.response?.data?.message || 'Failed to check out');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await apiService.bookings.cancelBooking(bookingId, {
        reason: 'Cancelled by user via dashboard',
      });
    } catch (error) {
      logger.error(error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return {
    booking,
    loading,
    goBack,
    goToModify,
    handleContinuePayment,
    handleCheckIn,
    handleCheckOut,
    handleCancel,
  };
};
