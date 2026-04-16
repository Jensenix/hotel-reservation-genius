import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { Phone, MapPin, Star } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white shadow-2xl border-b border-amber-700">
      {/* Top Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-black/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>123 Luxury Ave, Paradise City</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>5-Star Luxury</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-400">
              <span className="text-white font-bold text-xl">GSH</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Genius Society Hotel</h1>
              <p className="text-xs text-amber-200 font-light tracking-wider">LUXURY & COMFORT</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-amber-200 transition-colors duration-200 font-medium tracking-wide"
            >
              Home
            </Link>
            <Link 
              to="/our-rooms" 
              className="text-white hover:text-amber-200 transition-colors duration-200 font-medium tracking-wide"
            >
              Our Rooms
            </Link>
            <Link 
              to="/facilities" 
              className="text-white hover:text-amber-200 transition-colors duration-200 font-medium tracking-wide"
            >
              Facilities
            </Link>
            <Link 
              to="/bookings" 
              className="text-white hover:text-amber-200 transition-colors duration-200 font-medium tracking-wide"
            >
              My Bookings
            </Link>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 font-medium shadow-lg">
              Book Now
            </Button>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-blue-100">{user?.email}</p>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
