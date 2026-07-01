import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import Button from '@/components/ui/Button';
import { Phone, MapPin, Star, Menu, X } from 'lucide-react';
import { ImageAssets } from '@/config';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white shadow-2xl border-b border-amber-700">
      {/* Top Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-black/10 hidden sm:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
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

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4 relative">
          <div className="flex-1 flex justify-start min-w-0">
            <Link to="/" className="flex items-center space-x-3 z-50 min-w-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={ImageAssets.HotelLogo}
                  alt="Hotel Logo"
                  className="w-full h-full object-contain scale-110 md:scale-150"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-tight whitespace-nowrap">
                  Genius Society Hotel
                </h1>
                <p className="text-[10px] md:text-xs text-amber-200 font-light tracking-wider hidden sm:block">
                  LUXURY & COMFORT
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden xl:flex items-center space-x-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 z-30">
            <Link
              to="/"
              className="hover:text-amber-200 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/our-rooms"
              className="hover:text-amber-200 transition-colors duration-200 font-medium"
            >
              Our Rooms
            </Link>
            <Link
              to="/facilities"
              className="hover:text-amber-200 transition-colors duration-200 font-medium"
            >
              Facilities
            </Link>
            <Link
              to="/my-bookings"
              className="hover:text-amber-200 transition-colors duration-200 font-medium"
            >
              My Bookings
            </Link>
            <Link
              to="/reviews"
              className="hover:text-amber-200 transition-colors duration-200 font-medium"
            >
              Reviews
            </Link>

            <Button
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 font-medium shadow-lg"
              onClick={() => navigate('/our-rooms')}
            >
              Book Now
            </Button>
          </nav>
          {/* 3. THE RIGHT SIDE GROUP (User Profile only, Locked to the Right) */}
          <div className="flex-1 flex items-center justify-end space-x-4 shrink-0 z-20">
            <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-blue-100 hidden lg:block">
                          {user?.email}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
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
                      <Button size="sm">Register</Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden p-2 text-white hover:text-amber-200 transition-colors shrink-0"
                onClick={toggleMenu}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full right-2 left-2 sm:left-auto sm:w-80 mt-2 bg-amber-900 border border-amber-700/50 rounded-2xl shadow-2xl py-4 px-4 flex flex-col space-y-2 max-h-[80vh] overflow-y-auto">
          <Link
            to="/"
            onClick={toggleMenu}
            className="text-white hover:text-amber-200 font-medium text-base px-2 py-1"
          >
            Home
          </Link>
          <Link
            to="/our-rooms"
            onClick={toggleMenu}
            className="text-white hover:text-amber-200 font-medium text-base px-2 py-1"
          >
            Our Rooms
          </Link>
          <Link
            to="/facilities"
            onClick={toggleMenu}
            className="text-white hover:text-amber-200 font-medium text-base px-2 py-1"
          >
            Facilities
          </Link>
          <Link
            to="/my-bookings"
            onClick={toggleMenu}
            className="text-white hover:text-amber-200 font-medium text-base px-2 py-1"
          >
            My Bookings
          </Link>
          <Link
            to="/reviews"
            onClick={toggleMenu}
            className="text-white hover:text-amber-200 font-medium text-base px-2 py-1"
          >
            Reviews
          </Link>

          <div className="pt-4 border-t border-amber-800/50 flex flex-col space-y-3 mt-2">
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 font-bold shadow-lg rounded-xl"
              onClick={() => {
                navigate('/our-rooms');
                toggleMenu();
              }}
            >
              Book Now
            </Button>

            {isAuthenticated ? (
              <div className="bg-amber-950/40 rounded-xl p-4 flex flex-col space-y-4 border border-amber-800/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                    <span className="text-amber-900 font-bold text-sm">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-amber-200 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center border-amber-700 hover:bg-amber-800 text-white rounded-xl"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" onClick={toggleMenu} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu} className="flex-1">
                  <Button className="w-full rounded-xl">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
