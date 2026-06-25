import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (search) params.set('search', search);
    setSearchParams(params, { replace: true });
  }, [filter, search, setSearchParams]);

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
  };
};
