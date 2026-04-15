import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import OurRooms from './pages/OurRooms';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Facilities from './pages/Facilities';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import RevenueDashboard from './pages/admin/RevenueDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={isAuthenticated ? <MainLayout><Home /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/our-rooms" element={isAuthenticated ? <MainLayout><OurRooms /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/facilities" element={isAuthenticated ? <MainLayout><Facilities /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/bookings" element={isAuthenticated ? <MainLayout><MyBookings /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/booking/:roomId" element={isAuthenticated ? <MainLayout><Booking /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/booking-success" element={isAuthenticated ? <MainLayout><BookingSuccess /></MainLayout> : <Navigate to="/login" />} />
      <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/revenue" element={isAuthenticated && isAdmin ? <RevenueDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
