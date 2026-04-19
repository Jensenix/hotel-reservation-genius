import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import Button from '../../components/common/Button';
import Loading from '../../components/ui/Loading';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGuests, setTotalGuests] = useState(0);

  const guestsPerPage = 10;

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchGuests();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: guestsPerPage,
        search: searchTerm,
        role: 'guest'
      };

      console.log('Fetching guests with params:', params);
      const response = await apiService.guests.getAll(params);
      console.log('API response:', response);
      const data = response.data;

      console.log('Guests data:', data);
      setGuests(data.guests || []);
      setTotalGuests(data.totalGuests || 0);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error('Error fetching guests:', error);
      // Set empty state on error
      setGuests([]);
      setTotalGuests(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (guest) => {
    const completedBookings = guest.completedBookings || 0;
    const totalBookings = guest.totalBookings || 0;
    
    if (totalBookings === 0) {
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        icon: UserX,
        label: 'New'
      };
    } else if (completedBookings > 0) {
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        icon: UserCheck,
        label: 'Active'
      };
    } else {
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        icon: Clock,
        label: 'Pending'
      };
    }
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4.5) {
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        label: 'Excellent'
      };
    } else if (rating >= 3.5) {
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        label: 'Good'
      };
    } else if (rating >= 2.5) {
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        label: 'Average'
      };
    } else {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Poor'
      };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = async (guest) => {
    try {
      const response = await apiService.guests.getById(guest.id);
      setSelectedGuest(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching guest details:', error);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Export functionality would be implemented here');
  };

  // Calculate stats from guests data
  const activeGuests = guests.filter(g => g.completedBookings > 0).length;
  const newGuests = guests.filter(g => g.totalBookings === 0).length;
  const totalSpent = guests.reduce((sum, guest) => sum + (guest.totalSpent || 0), 0);
  const averageRating = guests.length > 0 
    ? guests.reduce((sum, guest) => sum + (guest.averageRating || 0), 0) / guests.length 
    : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loading text="Loading guest information..." size="lg" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with elegant styling */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
                  Guest <span className="font-semibold text-amber-600">Management</span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide uppercase">Manage and monitor registered guests</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-amber-100 text-xs uppercase tracking-wider mb-1">Total Guests</span>
                </div>
                <p className="text-3xl font-light text-white">{totalGuests}</p>
                <p className="text-sm text-amber-100 mt-1">Registered users</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 border border-emerald-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-100 text-xs uppercase tracking-wider mb-1">Active</span>
                </div>
                <p className="text-3xl font-light text-white">{activeGuests}</p>
                <p className="text-sm text-emerald-100 mt-1">With bookings</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-amber-100 text-xs uppercase tracking-wider mb-1">Avg Rating</span>
                </div>
                <p className="text-3xl font-light text-white">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-amber-100 mt-1">Guest satisfaction</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-emerald-100 text-xs uppercase tracking-wider mb-1">New</span>
                </div>
                <p className="text-3xl font-light text-white">{newGuests}</p>
                <p className="text-sm text-emerald-100 mt-1">No bookings yet</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    key="search-input"
                    type="text"
                    placeholder="Search guests by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Guests Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {guests.map((guest) => {
                    const statusConfig = getStatusBadge(guest);
                    const ratingConfig = getRatingBadge(guest.averageRating);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={guest.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{guest.fullName}</div>
                            <div className="text-sm text-slate-500">Member since {formatDate(guest.createdAt)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{guest.email}</div>
                          <div className="text-sm text-slate-500">{guest.phoneNumber || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ratingConfig.bg} ${ratingConfig.text}`}>
                              {guest.averageRating > 0 ? guest.averageRating.toFixed(1) : 'N/A'}
                            </div>
                            {guest.reviewCount > 0 && (
                              <span className="text-xs text-slate-500">({guest.reviewCount} reviews)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {guest.totalBookings || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {formatCurrency(guest.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(guest)}
                            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">
                  Showing {((currentPage - 1) * guestsPerPage) + 1} to {Math.min(currentPage * guestsPerPage, totalGuests)} of {totalGuests} guests
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-amber-600 text-white'
                          : 'border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details Modal */}
          {showDetails && selectedGuest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-slate-800 tracking-tight">Guest Details</h2>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Guest Info */}
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {selectedGuest.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800">{selectedGuest.fullName}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          {(() => {
                            const statusConfig = getStatusBadge(selectedGuest);
                            const StatusIcon = statusConfig.icon;
                            return (
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </div>
                            );
                          })()}
                          {selectedGuest.averageRating > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">{selectedGuest.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700">{selectedGuest.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700">{selectedGuest.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Statistics */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Booking Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="text-2xl font-semibold text-slate-800">{selectedGuest.totalBookings || 0}</div>
                          <div className="text-sm text-slate-500">Total Bookings</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="text-2xl font-semibold text-slate-800">{formatCurrency(selectedGuest.totalSpent || 0)}</div>
                          <div className="text-sm text-slate-500">Total Spent</div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-slate-700">Member since {formatDate(selectedGuest.createdAt)}</div>
                            <div className="text-sm text-slate-500">Registration date</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="text-slate-700">Last booking {formatDate(selectedGuest.lastBookingDate)}</div>
                            <div className="text-sm text-slate-500">Most recent stay</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Guests;
