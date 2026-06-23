import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (no token for now)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Room Types APIs
export const roomTypeAPI = {
  getAll: () => api.get('/room-types'),
  getById: (id) => api.get(`/room-types/${id}`),
  create: (data) => api.post('/room-types', data),
  update: (id, data) => api.put(`/room-types/${id}`, data),
  delete: (id) => api.delete(`/room-types/${id}`),
  getAllWithFacilities: () => api.get('/room-types/with-facilities'),
};

// Rooms APIs
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  getAvailable: (params) => api.get('/rooms/available', { params }),
  getAllWithRoomType: () => api.get('/rooms/with-room-type'),
};

// Bookings APIs
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  getUserBookings: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    return api.get(`/bookings/user/${userId}`);
  },
  getAdminBookings: (params) => api.get('/bookings/admin/all', { params }),
  checkAvailability: (params) => api.get('/bookings/check-availability', { params }),
  confirmBooking: (bookingId) => api.put(`/bookings/admin/${bookingId}/confirm`),
  checkInGuest: (bookingId) => api.put(`/bookings/admin/${bookingId}/check-in`),
  checkOutGuest: (bookingId) => api.put(`/bookings/admin/${bookingId}/check-out`),
  cancelBooking: (bookingId, data) => api.put(`/bookings/admin/${bookingId}/cancel`, data),
};

// Payment Methods APIs
export const paymentMethodAPI = {
  getAll: () => api.get('/payment-methods'),
  getById: (id) => api.get(`/payment-methods/${id}`),
  create: (data) => api.post('/payment-methods', data),
  update: (id, data) => api.put(`/payment-methods/${id}`, data),
  delete: (id) => api.delete(`/payment-methods/${id}`),
};

// Payments APIs
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
};

// Extra Services APIs
export const extraServiceAPI = {
  getAll: () => api.get('/extra-services'),
  getById: (id) => api.get(`/extra-services/${id}`),
  create: (data) => api.post('/extra-services', data),
  update: (id, data) => api.put(`/extra-services/${id}`, data),
  delete: (id) => api.delete(`/extra-services/${id}`),
};

// Booking Extra Services APIs
export const bookingExtraServiceAPI = {
  create: (data) => api.post('/booking-extra-services', data),
  getByBookingId: (bookingId) => api.get(`/booking-extra-services/booking/${bookingId}`),
  delete: (id) => api.delete(`/booking-extra-services/${id}`),
};

// Facilities APIs
export const facilityAPI = {
  getAll: () => api.get('/facilities'),
  getById: (id) => api.get(`/facilities/${id}`),
  create: (data) => api.post('/facilities', data),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

// Reviews APIs
export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getUserReviews: (userId) => api.get('/reviews/user', { params: { userId } }),
};

// Revenue APIs
export const revenueAPI = {
  getStats: (params) => api.get('/revenue/stats', { params }),
  getMonthlyRevenue: (params) => api.get('/revenue/monthly', { params }),
  getRevenueByRoomType: (params) => api.get('/revenue/by-room-type', { params }),
  getRecentTransactions: (params) => api.get('/revenue/recent-transactions', { params }),
};

// Room Availability APIs
export const roomAvailabilityAPI = {
  getStats: (params) => api.get('/room-availability/stats', { params }),
  getAvailability: (params) => api.get('/room-availability', { params }),
};

// Guests APIs
export const guestsAPI = {
  getAll: (params) => api.get('/guests', { params }),
  getById: (id) => api.get(`/guests/${id}`),
  getStats: (params) => api.get('/guests/stats', { params }),
};

// Users APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Export all APIs
const apiService = {
  auth: authAPI,
  roomTypes: roomTypeAPI,
  rooms: roomAPI,
  bookings: bookingAPI,
  paymentMethods: paymentMethodAPI,
  payments: paymentAPI,
  extraServices: extraServiceAPI,
  bookingExtraServices: bookingExtraServiceAPI,
  facilities: facilityAPI,
  reviews: reviewAPI,
  revenue: revenueAPI,
  roomAvailability: roomAvailabilityAPI,
  guests: guestsAPI,
  users: userAPI,
};

export default apiService;
