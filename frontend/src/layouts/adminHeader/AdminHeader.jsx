import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import {
  LayoutDashboard,
  DollarSign,
  Home,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  Coffee,
  CreditCard,
  Settings,
} from 'lucide-react';

import ManagementDropdown from './ManagementDropdown';
import MobileNav from './MobileNav';

/**
 * @returns {Array<Object>}
 */
const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { path: '/admin/availability', label: 'Availability', icon: Home },
  { path: '/admin/guests', label: 'Guests', icon: Users },
  { path: '/admin/rooms', label: 'Rooms', icon: Building2 },
];

/**
 * @returns {Array<Object>}
 */
const managementItems = [
  { path: '/admin/facilities', label: 'Facilities', icon: Coffee },
  { path: '/admin/extra-services', label: 'Extra Services', icon: Settings },
  {
    path: '/admin/payment-methods',
    label: 'Payment Methods',
    icon: CreditCard,
  },
];

/**
 * @returns {JSX.Element}
 */
const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg leading-tight">
                  Admin Portal
                </h1>
                <p className="text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">
                  Genius Society Hotel
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Shifted to XL to prevent squishing */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}

            <ManagementDropdown items={managementItems} isActive={isActive} />
          </nav>

          {/* User & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* User Info - Hidden on tablet to save space */}
            <div className="hidden xl:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium whitespace-nowrap">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>

            {/* Desktop Logout - Hidden below XL */}
            <button
              onClick={handleLogout}
              className="hidden xl:flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shrink-0"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>

            {/* Mobile/Tablet Menu Toggle - Visible up to XL */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          adminNavItems={adminNavItems}
          managementItems={managementItems}
          isActive={isActive}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default AdminHeader;
