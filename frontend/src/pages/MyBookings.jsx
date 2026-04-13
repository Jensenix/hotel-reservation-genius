import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';
import Loading from '../components/ui/Loading';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, checked_in, checked_out, cancelled

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const response = await apiService.getBookings();
      const allBookings = response.data.data;
      
      // Filter bookings for current user only
      const userBookings = allBookings.filter(booking => booking.userId === user.id);
      
      console.log('User bookings:', userBookings);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>
            <Loading text="Loading your bookings..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">View and manage your hotel reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 border-b border-gray-200">
            {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  filter === status
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status === 'all' ? 'All' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {filter === 'all' 
                ? "You haven't made any bookings yet" 
                : `No ${getStatusText(filter)} bookings found`
              }
            </div>
            <Button onClick={() => window.location.href = '/our-rooms'}>
              Browse Our Rooms
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Room Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-bold">
                          {booking.room?.roomType?.name?.charAt(0) || 'R'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {booking.room?.roomType?.name || 'Room'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Check-in:</span>
                            <div>{formatDate(booking.checkInDate)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Check-out:</span>
                            <div>{formatDate(booking.checkOutDate)}</div>
                          </div>
                        </div>
                        {booking.specialRequests && (
                          <div className="mt-3">
                            <span className="font-medium text-sm text-gray-700">Special Requests:</span>
                            <p className="text-sm text-gray-600 mt-1">{booking.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      <div className="text-2xl font-bold text-gray-900">
                        ${booking.totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Price
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/booking/${booking.room?.roomTypeId}`}
                        >
                          Modify
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button size="sm">
                          Check In
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
