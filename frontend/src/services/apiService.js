import { authAPI, userAPI } from './endpoints/auth.service';
import { roomTypeAPI, roomAPI, facilityAPI, roomAvailabilityAPI } from './endpoints/rooms.service';
import { bookingAPI, bookingExtraServiceAPI, reviewAPI } from './endpoints/booking.service';
import { paymentMethodAPI, paymentAPI, extraServiceAPI } from './endpoints/billing.service';
import { revenueAPI, guestsAPI } from './endpoints/admin.service';

/**
 * Centralized API Service Facade.
 * Re-exports domain-specific API modules to maintain backward compatibility 
 * with existing imports across the application.
 */
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