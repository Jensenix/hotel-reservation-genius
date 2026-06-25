import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { Phone, MapPin, Star, Menu, X } from 'lucide-react';

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
      {/* Top Bar - Hidden on very small screens, reduced content on mobile */}
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

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo - Added min-w-0 and truncate to prevent text from pushing menu off screen */}
          <Link to="/" className="flex items-center space-x-3 z-50 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-400 shrink-0">
              <span className="text-white font-bold text-lg md:text-xl">GSH</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight truncate">
                Genius Society Hotel
              </h1>
              <p className="text-[10px] md:text-xs text-amber-200 font-light tracking-wider hidden sm:block">
                LUXURY & COMFORT
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 shrink-0">
            <Link to="/" className="hover:text-amber-200 transition-colors duration-200 font-medium">Home</Link>
            <Link to="/our-rooms" className="hover:text-amber-200 transition-colors duration-200 font-medium">Our Rooms</Link>
            <Link to="/facilities" className="hover:text-amber-200 transition-colors duration-200 font-medium">Facilities</Link>
            <Link to="/my-bookings" className="hover:text-amber-200 transition-colors duration-200 font-medium">My Bookings</Link>
            <Link to="/reviews" className="hover:text-amber-200 transition-colors duration-200 font-medium">Reviews</Link>
            <Button
              onClick={() => navigate('/our-rooms')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2 font-medium shadow-lg"
            >
              Book Now
            </Button>
          </nav>

          {/* Desktop User Section & Mobile Toggle - Added shrink-0 here! */}
          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{user?.fullName}</p>
                      <p className="text-xs text-blue-100">{user?.email}</p>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
                  <Link to="/register"><Button size="sm">Register</Button></Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-white hover:text-amber-200 transition-colors"
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-amber-900 border-b border-amber-800 shadow-xl py-4 px-4 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={toggleMenu} className="text-white hover:text-amber-200 font-medium text-lg">Home</Link>
          <Link to="/our-rooms" onClick={toggleMenu} className="text-white hover:text-amber-200 font-medium text-lg">Our Rooms</Link>
          <Link to="/facilities" onClick={toggleMenu} className="text-white hover:text-amber-200 font-medium text-lg">Facilities</Link>
          <Link to="/my-bookings" onClick={toggleMenu} className="text-white hover:text-amber-200 font-medium text-lg">My Bookings</Link>
          <Link to="/reviews" onClick={toggleMenu} className="text-white hover:text-amber-200 font-medium text-lg">Reviews</Link>
          
          <div className="pt-4 border-t border-amber-800/50 flex flex-col space-y-3">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 font-bold shadow-lg"
              onClick={() => navigate('/our-rooms')}
            >
              Book Now
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                    <span className="text-amber-900 font-bold">{user?.fullName?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{user?.fullName}</p>
                    <p className="text-xs text-amber-200">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Button>
              </div>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link to="/login" onClick={toggleMenu} className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link>
                <Link to="/register" onClick={toggleMenu} className="flex-1"><Button className="w-full">Register</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;