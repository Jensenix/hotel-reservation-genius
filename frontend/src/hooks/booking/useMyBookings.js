import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import apiService from '@/services/api/apiService';

export const useMyBookings = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    let isMounted = true;

    const fetchUserBookings = async () => {
      try {
        const response = await apiService.bookings.getUserBookings();
        if (isMounted) {
          const userBookings = response.data.data.filter(
            (booking) => booking.userId === userId,
          );
          setBookings(userBookings);
        }
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchUserBookings();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (search) params.set('search', search);
    setSearchParams(params, { replace: true });
  }, [filter, search, setSearchParams]);

  const handleCheckIn = async (bookingId) => {
    try {
      await apiService.bookings.selfCheckIn(bookingId);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: 'checked_in' }
            : booking,
        ),
      );
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      console.error('Could not find booking to check out:', bookingId);
      alert('Something went wrong. Please refresh and try again.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(booking.checkOutDate);
    checkOutDate.setHours(0, 0, 0, 0);

    if (today < checkOutDate) {
      alert(
        'You need to wait until your checkout date, or please ask the admin to assist you with an early checkout.',
      );
      return;
    }

    if (checkOutDate < today) {
      alert(
        'Your checkout date has passed. Please contact the admin to assist you with the checkout process.',
      );
      return;
    }

    try {
      await apiService.bookings.selfCheckOut(bookingId);

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'checked_out' } : b,
        ),
      );
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to process checkout. Please try again or contact support.');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter = filter === 'all' || booking.status === filter;
      const lowerSearch = search.toLowerCase();
      const matchesSearch =
        !search ||
        booking.id.toString().includes(lowerSearch) ||
        booking.room?.roomNumber?.toLowerCase().includes(lowerSearch) ||
        booking.room?.roomType?.name?.toLowerCase().includes(lowerSearch) ||
        booking.checkInDate?.toLowerCase().includes(lowerSearch) ||
        booking.checkOutDate?.toLowerCase().includes(lowerSearch);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  return {
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    filteredBookings,
    handleCheckIn,
    handleCheckOut,
  };
};