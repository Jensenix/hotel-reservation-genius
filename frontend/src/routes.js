import { lazy } from 'react';

const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));

const Home = lazy(() => import('@/pages/public/Home'));
const OurRooms = lazy(() => import('@/pages/public/OurRooms'));
const Facilities = lazy(() => import('@/pages/public/Facilities'));
const Reviews = lazy(() => import('@/pages/public/Reviews'));

const Booking = lazy(() => import('@/pages/booking/Booking'));
const BookingSuccess = lazy(() => import('@/pages/booking/BookingSuccess'));
const BookingDetail = lazy(() => import('@/pages/booking/BookingDetail'));
const MyBookings = lazy(() => import('@/pages/booking/MyBookings'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RevenueDashboard = lazy(() => import('@/pages/admin/RevenueDashboard'));
const RoomAvailability = lazy(() => import('@/pages/admin/RoomAvailability'));
const Guests = lazy(() => import('@/pages/admin/Guests'));
const RoomManagement = lazy(() => import('@/pages/admin/RoomManagement'));
const RoomTypeDetail = lazy(() => import('@/pages/admin/RoomTypeDetail'));
const FacilitiesManagement = lazy(() => import('@/pages/admin/FacilitiesManagement'));
const ExtraServicesManagement = lazy(() => import('@/pages/admin/ExtraServicesManagement'));
const PaymentMethodsManagement = lazy(() => import('@/pages/admin/PaymentMethodsManagement'));

/**
 * Route Configuration Definitions
 * type: 'public' | 'protected' | 'admin'
 * layout: boolean (whether it wraps inside MainLayout)
 */
export const routesConfig = [
  // Auth Routes
  { path: '/login', component: Login, type: 'public', layout: false },
  { path: '/register', component: Register, type: 'public', layout: false },

  // Public Route
  { path: '/', component: Home, type: 'public', layout: true },

  // Protected Routes
  { path: '/our-rooms', component: OurRooms, type: 'protected', layout: true },
  { path: '/facilities', component: Facilities, type: 'protected', layout: true },
  { path: '/my-bookings', component: MyBookings, type: 'protected', layout: true },
  { path: '/reviews', component: Reviews, type: 'protected', layout: true },
  { path: '/booking/:roomId', component: Booking, type: 'protected', layout: true },
  { path: '/booking-success', component: BookingSuccess, type: 'protected', layout: true },
  { path: '/my-bookings/details/:id', component: BookingDetail, type: 'protected', layout: true },

  //  Admin Routes 
  { path: '/admin', component: AdminDashboard, type: 'admin', layout: false },
  { path: '/admin/revenue', component: RevenueDashboard, type: 'admin', layout: false },
  { path: '/admin/availability', component: RoomAvailability, type: 'admin', layout: false },
  { path: '/admin/guests', component: Guests, type: 'admin', layout: false },
  { path: '/admin/rooms', component: RoomManagement, type: 'admin', layout: false },
  { path: '/admin/rooms/:roomTypeId', component: RoomTypeDetail, type: 'admin', layout: false },
  { path: '/admin/facilities', component: FacilitiesManagement, type: 'admin', layout: false },
  { path: '/admin/extra-services', component: ExtraServicesManagement, type: 'admin', layout: false },
  { path: '/admin/payment-methods', component: PaymentMethodsManagement, type: 'admin', layout: false },
];