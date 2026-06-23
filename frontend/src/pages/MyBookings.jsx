import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import Loading from '@/components/ui/Loading';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Shield,
  Users,
  Star,
} from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, checked_in, checked_out, cancelled
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await apiService.bookings.getUserBookings();
        const allBookings = response.data.data;

        // Filter bookings for current user only
        const userBookings = allBookings.filter(
          (booking) => booking.userId === user.id,
        );

        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  // Parse query params on mount
  useEffect(() => {
    const statusFilter = searchParams.get('status') || 'all';
    const searchQuery = searchParams.get('search') || '';
    setFilter(statusFilter);
    setSearch(searchQuery);
  }, [searchParams]);

  // Update URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (search) params.set('search', search);

    setSearchParams(params, { replace: true });
  }, [filter, search, setSearchParams]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch =
      !search ||
      booking.id.toString().includes(search) ||
      booking.room?.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
      booking.room?.roomType?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.checkInDate?.toLowerCase().includes(search.toLowerCase()) ||
      booking.checkOutDate?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'checked_in':
        return 'Checked In';
      case 'checked_out':
        return 'Checked Out';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Calendar className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">
                MY RESERVATIONS
              </span>
              <Calendar className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              My Bookings
            </h1>
            <Loading text="Loading your bookings..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 pb-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Calendar className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">
                MY RESERVATIONS
              </span>
              <Calendar className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              My Bookings
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              View and manage your hotel reservations with ease
            </p>
            <div className="flex items-center justify-center space-x-6 mt-8">
              <div className="flex items-center space-x-2 text-amber-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Easy Management</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure Booking</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white border-y border-amber-100">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Filter Bookings
                  </h2>
                  <p className="text-gray-600">
                    Quickly find your reservations by status
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  'all',
                  'pending',
                  'confirmed',
                  'checked_in',
                  'checked_out',
                  'cancelled',
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-6 py-3 font-medium text-sm rounded-lg border-2 transition-all duration-200 ${
                      filter === status
                        ? 'bg-amber-600 text-white border-amber-600 shadow-lg'
                        : 'bg-white text-gray-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {status === 'all' && <Filter className="w-4 h-4" />}
                      {status === 'pending' && (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {status === 'confirmed' && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {status === 'checked_in' && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {status === 'checked_out' && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {status === 'cancelled' && (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>
                        {status === 'all'
                          ? 'All Bookings'
                          : getStatusText(status)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${getStatusText(filter)} bookings found`}
            </div>
            <Button onClick={() => (window.location.href = '/our-rooms')}>
              Browse Our Rooms
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer"
                onClick={() => navigate(`/my-bookings/details/${booking.id}`)}
              >
                {/* Room Image */}
                <div className="relative h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white text-4xl font-bold mb-1">
                        {booking.room?.roomType?.name?.charAt(0) || 'R'}
                      </div>
                      <div className="text-white/90 text-xs">
                        {booking.room?.roomType?.maxCapacity
                          ? `${booking.room.roomType.maxCapacity} Guests`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.room?.roomType?.name || 'Room'}
                      </h3>
                      <span className="text-sm font-medium text-gray-500">
                        #{booking.id}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(booking.checkInDate)} -{' '}
                          {formatDate(booking.checkOutDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          Max{' '}
                          {booking.room?.roomType?.maxCapacity
                            ? `${booking.room.roomType.maxCapacity} guests`
                            : 'N/A'}
                        </span>
                      </div>

                      {booking.specialRequests && (
                        <div className="pt-2 border-t border-gray-100">
                          <span className="font-medium text-gray-700">
                            Special Requests:
                          </span>
                          <p className="text-gray-600 mt-1 text-xs">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold text-amber-600">
                          ${booking.totalPrice}
                        </div>
                        <div className="text-xs text-gray-500">Total Price</div>
                      </div>
                    </div>

                    <div
                      className="flex space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                          onClick={() =>
                            navigate(`/booking/${booking.room?.roomTypeId}`, {
                              state: { bookingId: booking.id },
                            })
                          }
                        >
                          Continue Payment
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                        >
                          Check In
                        </Button>
                      )}
                      {booking.status === 'checked_in' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                        >
                          Check Out
                        </Button>
                      )}
                      {booking.status === 'checked_out' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                          onClick={() =>
                            navigate('/reviews', {
                              state: { bookingId: booking.id },
                            })
                          }
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
