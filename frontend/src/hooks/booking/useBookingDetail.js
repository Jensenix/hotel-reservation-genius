import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { getCheckOutBlockedReason } from '@/utils/bookingActionUtils';
import { useWebSocket } from '@/hooks/useWebSocket'; // ADD THIS

export const useBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // REAL-TIME EVENT SUBSCRIPTION
  // ---------------------------------------------------------------------------
  useWebSocket('booking:status_changed', (payload) => {
    if (!payload || !payload.bookingId || !payload.status) return;

    // Instantly update UI if the admin changes the status of THIS booking
    setBooking((prevBooking) => {
      if (prevBooking && String(prevBooking.id) === String(payload.bookingId)) {
        return { ...prevBooking, status: payload.status };
      }
      return prevBooking;
    });
  });
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchBookingDetail = async () => {
      try {
        const response = await apiService.bookings.getById(id);
        if (isMounted) {
          setBooking(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching booking detail:', error);
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

  const handleCheckIn = async () => {
    try {
      await apiService.bookings.selfCheckIn(id);
      // Local state is updated automatically via the useWebSocket hook above!
    } catch (error) {
      console.error('Error checking in:', error);
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
      // Local state is updated automatically via the useWebSocket hook above!
    } catch (error) {
      console.error('Error checking out:', error);
      alert(error.response?.data?.message || 'Failed to check out');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await apiService.bookings.cancelBooking(bookingId, { 
        reason: 'Cancelled by user via dashboard' 
      });
      // Local state is updated automatically via the useWebSocket hook above!
    } catch (error) {
      console.error('Cancel failed:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return {
    booking,
    loading,
    goBack,
    goToModify,
    handleCheckIn,
    handleCheckOut,
    handleCancel,
  };
};