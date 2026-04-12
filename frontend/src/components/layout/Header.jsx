import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
