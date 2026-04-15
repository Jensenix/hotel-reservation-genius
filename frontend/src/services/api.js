import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    console.error('Error Response:', error.response?.data);
    console.error('Error Status:', error.response?.status);
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Room Types
  getRoomTypes: () => api.get('/room-types'),
  getRoomTypesWithFacilities: () => api.get('/room-types/with-facilities'),
  getRoomTypeById: (id) => api.get(`/room-types/${id}`),
  
  // Rooms
  getRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  getAvailableRooms: (params) => api.get('/rooms/available', { params }),
  
  // Facilities
  getFacilities: () => api.get('/facilities'),
  getFacilityById: (id) => api.get(`/facilities/${id}`),
  
  // Bookings
  getBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  checkAvailability: (params) => api.get('/bookings/check-availability', { params }),
  
  // Extra Services
  getExtraServices: () => api.get('/extra-services'),
  getExtraServiceById: (id) => api.get(`/extra-services/${id}`),
  
  // Payment Methods
  getPaymentMethods: () => api.get('/payment-methods'),
  getPaymentMethodById: (id) => api.get(`/payment-methods/${id}`),
  
  // Payments
  getPayments: () => api.get('/payments'),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  createPayment: (paymentData) => api.post('/payments', paymentData),

  // Admin Booking Management
  getAdminBookings: (filters) => api.get('/bookings/admin/all', { params: filters }),
  confirmBooking: (bookingId) => api.put(`/bookings/admin/${bookingId}/confirm`),
  checkInGuest: (bookingId) => api.put(`/bookings/admin/${bookingId}/check-in`),
  checkOutGuest: (bookingId) => api.put(`/bookings/admin/${bookingId}/check-out`),
  cancelBooking: (bookingId, data) => api.put(`/bookings/admin/${bookingId}/cancel`, data),
};

export default api;
