import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  DollarSign,
  Home,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronDown,
  Coffee,
  CreditCard,
  Settings,
} from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(
    'AdminHeader rendered - User:',
    user?.fullName,
    'Role:',
    user?.role,
    'Location:',
    location.pathname,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [managementDropdownOpen, setManagementDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        managementDropdownOpen &&
        !event.target.closest('.management-dropdown')
      ) {
        setManagementDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [managementDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/revenue', label: 'Revenue', icon: DollarSign },
    { path: '/admin/availability', label: 'Availability', icon: Home },
    { path: '/admin/guests', label: 'Guests', icon: Users },
    { path: '/admin/rooms', label: 'Rooms', icon: Building2 },
  ];

  const managementItems = [
    { path: '/admin/facilities', label: 'Facilities', icon: Coffee },
    { path: '/admin/extra-services', label: 'Extra Services', icon: Settings },
    {
      path: '/admin/payment-methods',
      label: 'Payment Methods',
      icon: CreditCard,
    },
  ];

  console.log('Admin Nav Items:', adminNavItems);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Portal</h1>
                <p className="text-slate-400 text-xs">Genius Society Hotel</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Management Dropdown */}
            <div className="relative management-dropdown">
              <button
                onClick={() =>
                  setManagementDropdownOpen(!managementDropdownOpen)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  managementItems.some((item) => isActive(item.path))
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Settings size={16} />
                <span>Management</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${managementDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {managementDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  {managementItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setManagementDropdownOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {user?.fullName}
                </p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Management Items */}
              <div className="pt-2 pb-2 border-t border-slate-700">
                <div className="px-3 py-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Management
                </div>
                {managementItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Info */}
              <div className="pt-4 pb-3 border-t border-slate-700 mt-3">
                <div className="px-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {user?.fullName}
                      </p>
                      <p className="text-slate-400 text-xs">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
