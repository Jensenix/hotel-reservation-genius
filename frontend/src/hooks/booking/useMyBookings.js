import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import apiService from '@/services/api/apiService';
import { getCheckOutBlockedReason } from '@/utils/bookingActionUtils';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RealtimeEvents } from '@/shared/eventContract.js';
import { logger } from '@/config';

/**
 * @returns {{
 *   loading: boolean,
 *   filter: string,
 *   setFilter: Function,
 *   search: string,
 *   setSearch: Function,
 *   filteredBookings: Array<Object>,
 *   handleCheckIn: Function,
 *   handleCheckOut: Function
 * }}
 */
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
        logger.error(error);
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
      logger.error(error);
    }
  };

  const handleCheckOut = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      alert('Something went wrong. Please refresh and try again.');
      return;
    }

    const blockedReason = getCheckOutBlockedReason(booking);
    if (blockedReason) {
      alert(blockedReason);
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
      logger.error(error);
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

  useWebSocket(RealtimeEvents.BOOKING.CREATED, (data) => {
    if (data.userId !== userId) return;

    setBookings((prev) => {
      const exists = prev.some((b) => b.id === data.bookingId);
      if (exists) return prev;

      return [
        {
          id: data.bookingId,
          userId: data.userId,
          roomId: data.roomId,
          status: data.status,
        },
        ...prev,
      ];
    });
  });

  useWebSocket(RealtimeEvents.BOOKING.STATUS_CHANGED, (data) => {
    if (!data || !data.bookingId || !data.status) return;

    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        String(b.id) === String(data.bookingId)
          ? { ...b, status: data.status }
          : b,
      ),
    );
  });

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
