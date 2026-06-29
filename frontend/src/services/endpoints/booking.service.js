import { apiClient } from '@/services/api/apiClient';

/**
 * Core reservation lifecycle endpoints.
 */
export const bookingAPI = {
  getAll: () => apiClient.get('/bookings'),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  create: (data) => apiClient.post('/bookings', data),
  update: (id, data) => apiClient.put(`/bookings/${id}`, data),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
  getUserBookings: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    return apiClient.get(`/bookings/user/${userId}`);
  },
  getAdminBookings: (params) =>
    apiClient.get('/bookings/admin/all', { params }),
  checkAvailability: (params) =>
    apiClient.get('/bookings/check-availability', { params }),
  confirmBooking: (bookingId) =>
    apiClient.put(`/bookings/admin/${bookingId}/confirm`),
  checkInGuest: (bookingId) =>
    apiClient.put(`/bookings/admin/${bookingId}/check-in`),
  checkOutGuest: (bookingId) =>
    apiClient.put(`/bookings/admin/${bookingId}/check-out`),
    
  adminCancelBooking: (bookingId, data) =>
    apiClient.put(`/bookings/admin/${bookingId}/cancel`, data),
    
  cancelBooking: (bookingId, data) =>
    apiClient.put(`/bookings/${bookingId}/cancel`, data),
    
  selfCheckIn: (id) => apiClient.put(`/bookings/${id}/self-check-in`),
  selfCheckOut: (id) => apiClient.put(`/bookings/${id}/self-check-out`),
};

/**
 * Endpoints for managing extra services attached to a specific booking.
 */
export const bookingExtraServiceAPI = {
  create: (data) => apiClient.post('/booking-extra-services', data),
  getByBookingId: (bookingId) =>
    apiClient.get(`/booking-extra-services/booking/${bookingId}`),
  delete: (id) => apiClient.delete(`/booking-extra-services/${id}`),
};

/**
 * Guest reviews and ratings endpoints.
 */
export const reviewAPI = {
  getAll: () => apiClient.get('/reviews'),
  getById: (id) => apiClient.get(`/reviews/${id}`),
  create: (data) => apiClient.post('/reviews', data),
  update: (id, data) => apiClient.put(`/reviews/${id}`, data),
  delete: (id) => apiClient.delete(`/reviews/${id}`),
  getUserReviews: (userId) =>
    apiClient.get('/reviews/user', { params: { userId } }),
};