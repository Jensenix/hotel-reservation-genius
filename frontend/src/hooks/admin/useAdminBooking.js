import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { useWebSocket } from '@/hooks/useWebSocket';

export const useAdminBooking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ---------------------------------------------------------------------------
  // URL SYNC & FETCHING LOGIC (Must be declared before WebSockets)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page')) || 1;
    const urlLimit = parseInt(searchParams.get('limit')) || 10;

    if (
      urlStatus !== filters.status ||
      urlSearch !== filters.search ||
      urlPage !== filters.page ||
      urlLimit !== filters.limit
    ) {
      setTimeout(() => {
        setFilters({
          status: urlStatus,
          search: urlSearch,
          page: urlPage,
          limit: urlLimit,
        });
      }, 0);
    }
  }, [searchParams, filters.status, filters.search, filters.page, filters.limit]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.bookings.getAdminBookings(filters);
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
      }
  } catch (error) {
      console.error('Error fetching admin bookings:', error);
    } finally {
      setLoading(false);
  }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchBookings();
    }, 500);
    return () => clearTimeout(timeout);
  }, [fetchBookings]);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [loading]);

  // ---------------------------------------------------------------------------
  // REAL-TIME EVENT SUBSCRIPTIONS
  // ---------------------------------------------------------------------------
  useWebSocket('booking:status_changed', (payload) => {
    if (!payload || !payload.bookingId || !payload.status) return;

    // Instantly update the booking in the main table list
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        String(b.id) === String(payload.bookingId) 
          ? { ...b, status: payload.status } 
          : b
      )
    );

    // Instantly update the detail modal if the admin is currently viewing it
    setBookingDetails((prevDetails) => {
      if (prevDetails && String(prevDetails.id) === String(payload.bookingId)) {
        return { ...prevDetails, status: payload.status };
      }
      return prevDetails;
    });
  });

  useWebSocket('booking:created', () => {
    // If we are on page 1 and no specific filters are applied, auto-refresh to show it
    if (filters.page === 1 && !filters.search && !filters.status) {
      fetchBookings();
    }
  });

  // ---------------------------------------------------------------------------
  // UI ACTIONS
  // ---------------------------------------------------------------------------
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.limit !== 10) params.set('limit', newFilters.limit.toString());
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key !== 'page') newFilters.page = 1;
  
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const executeAction = async () => {
    try {
      let response;
      const bookingId = selectedBooking.id;

      switch (actionType) {
        case 'confirm':
          response = await apiService.bookings.confirmBooking(bookingId);
          break;
        case 'check-in':
          response = await apiService.bookings.checkInGuest(bookingId);
          break;
        case 'check-out':
          response = await apiService.bookings.checkOutGuest(bookingId);
          break;
        case 'cancel':
          response = await apiService.bookings.adminCancelBooking(bookingId, {
            reason: cancelReason,
          });
          break;
        default:
          return;
      }

      if (response.data.success) {
        setShowActionModal(false);
        setSelectedBooking(null);
        setCancelReason('');
        // Handled instantly via websocket, no need to manually fetchBookings
      }
    } catch (error) {
      console.error('Error executing action:', error);
      alert(error.response?.data?.message || 'Failed to execute action');
    }
  };

  const fetchBookingDetails = async (booking) => {
    try {
      setLoadingDetails(true);
      setSelectedBooking(booking);
      setShowDetailModal(true);
      const response = await apiService.bookings.getById(booking.id);
      setBookingDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return {
    state: {
      bookings,
      loading,
      filters,
      pagination,
      selectedBooking,
      showActionModal,
      actionType,
      cancelReason,
      showDetailModal,
      bookingDetails,
      loadingDetails,
    },
    refs: { searchInputRef },
    actions: {
      handleFilterChange,
      fetchBookings,
      executeAction,
      fetchBookingDetails,
      setShowActionModal,
      setActionType,
      setSelectedBooking,
      setCancelReason,
      setShowDetailModal,
      setBookingDetails,
    },
  };
};