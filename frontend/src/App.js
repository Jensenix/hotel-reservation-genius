import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
