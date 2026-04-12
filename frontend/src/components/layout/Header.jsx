import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">GSH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Genius Society Hotel</h1>
              <p className="text-xs text-blue-100">Luxury & Comfort</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/rooms" 
              className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Rooms
            </Link>
            <Link 
              to="/facilities" 
              className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Facilities
            </Link>
            <Link 
              to="/bookings" 
              className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Bookings
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
