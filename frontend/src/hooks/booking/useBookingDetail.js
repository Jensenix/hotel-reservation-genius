import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '@/services/api/apiService';

export const useBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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
      await apiService.bookings.checkInGuest(id);
      
      setBooking((prev) => ({
        ...prev,
        status: 'checked_in',
      }));
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await apiService.bookings.checkOutGuest(id);
      
      setBooking((prev) => ({
        ...prev,
        status: 'checked_out',
      }));
    } catch (error) {
      console.error('Error checking out:', error);
      alert(error.response?.data?.message || 'Failed to check out');
    }
  };

  return { 
    booking, 
    loading, 
    goBack, 
    goToModify, 
    handleCheckIn,
    handleCheckOut 
  };
};