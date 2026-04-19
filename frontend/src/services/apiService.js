import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      localStorage.removeItem('token');
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
};

// Rooms APIs
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  getAvailable: (params) => api.get('/rooms/available', { params }),
};

// Bookings APIs
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  getAdminBookings: (params) => api.get('/bookings/admin', { params }),
};

// Payments APIs
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
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
  getUserReviews: () => api.get('/reviews/user'),
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

// Export all APIs
const apiService = {
  auth: authAPI,
  roomTypes: roomTypeAPI,
  rooms: roomAPI,
  bookings: bookingAPI,
  payments: paymentAPI,
  facilities: facilityAPI,
  reviews: reviewAPI,
  revenue: revenueAPI,
  roomAvailability: roomAvailabilityAPI,
  guests: guestsAPI,
};

export default apiService;
