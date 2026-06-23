import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import OurRooms from './pages/OurRooms';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import BookingDetail from './pages/BookingDetail';
import Facilities from './pages/Facilities';
import MyBookings from './pages/MyBookings';
import Reviews from './pages/Reviews';
import AdminDashboard from './pages/admin/AdminDashboard';
import RevenueDashboard from './pages/admin/RevenueDashboard';
import RoomAvailability from './pages/admin/RoomAvailability';
import Guests from './pages/admin/Guests';
import RoomManagement from './pages/admin/RoomManagement';
import RoomTypeDetail from './pages/admin/RoomTypeDetail';

import FacilitiesManagement from './pages/admin/FacilitiesManagement';
import ExtraServicesManagement from './pages/admin/ExtraServicesManagement';
import PaymentMethodsManagement from './pages/admin/PaymentMethodsManagement';

import Login from './pages/Login';
import Register from './pages/Register';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      
      {/* Protected Routes */}
      <Route path="/our-rooms" element={isAuthenticated ? <MainLayout><OurRooms /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/facilities" element={isAuthenticated ? <MainLayout><Facilities /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/my-bookings" element={isAuthenticated ? <MainLayout><MyBookings /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/reviews" element={isAuthenticated ? <MainLayout><Reviews /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/booking/:roomId" element={isAuthenticated ? <MainLayout><Booking /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/booking-success" element={isAuthenticated ? <MainLayout><BookingSuccess /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/my-bookings/details/:id" element={isAuthenticated ? <MainLayout><BookingDetail /></MainLayout> : <Navigate to="/login" />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/revenue" element={isAuthenticated && isAdmin ? <RevenueDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/availability" element={isAuthenticated && isAdmin ? <RoomAvailability /> : <Navigate to="/login" />} />
      <Route path="/admin/guests" element={isAuthenticated && isAdmin ? <Guests /> : <Navigate to="/login" />} />
      <Route path="/admin/rooms" element={isAuthenticated && isAdmin ? <RoomManagement /> : <Navigate to="/login" />} />
      <Route path="/admin/rooms/:roomTypeId" element={isAuthenticated && isAdmin ? <RoomTypeDetail /> : <Navigate to="/login" />} />
      
      {/* 🚀 Our newly refactored routes */}
      <Route path="/admin/facilities" element={isAuthenticated && isAdmin ? <FacilitiesManagement /> : <Navigate to="/login" />} />
      <Route path="/admin/extra-services" element={isAuthenticated && isAdmin ? <ExtraServicesManagement /> : <Navigate to="/login" />} />
      <Route path="/admin/payment-methods" element={isAuthenticated && isAdmin ? <PaymentMethodsManagement /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;