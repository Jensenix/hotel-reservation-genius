import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '@/services/apiService';
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Star,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = await apiService.bookings.getById(id);
        setBooking(response.data.data);
      } catch (error) {
        console.error('Error fetching booking detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'checked_in':
        return <CheckCircle className="w-4 h-4" />;
      case 'checked_out':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Booking not found</p>
            <button
              onClick={() => navigate('/my-bookings')}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Bookings</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">Booking #{booking.id}</p>
            </div>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${getStatusColor(booking.status)}`}
            >
              {getStatusIcon(booking.status)}
              <span className="font-medium">
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
              <div className="relative h-48 bg-gradient-to-br from-amber-400 to-amber-600">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-6xl font-bold mb-2">
                      {booking.room?.roomType?.name?.charAt(0) || 'R'}
                    </div>
                    <div className="text-white/90 text-lg">
                      {booking.room?.roomType?.name || 'Room'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {booking.room?.roomType?.name || 'Room'}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs text-gray-600">Room Number</div>
                      <div className="font-semibold text-gray-900">
                        {booking.room?.roomNumber || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <Users className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs text-gray-600">Max Guests</div>
                      <div className="font-semibold text-gray-900">
                        {booking.room?.roomType?.maxCapacity
                          ? `${booking.room.roomType.maxCapacity} Guests`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-amber-100 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Room Description
                  </h3>
                  <p className="text-gray-600 text-sm">
                    A comfortable and well-appointed{' '}
                    {booking.room?.roomType?.name || 'room'} perfect for your
                    stay. Features modern amenities and elegant decor.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Booking Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Check-in Date</div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(booking.checkInDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-600">Check-out Date</div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(booking.checkOutDate)}
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <div className="font-semibold text-gray-900">
                        Special Requests
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Extra Services Card */}
            {booking.extraServices && booking.extraServices.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Extra Services
                </h2>

                <div className="space-y-3">
                  {booking.extraServices.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-amber-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.serviceName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.BookingExtraService?.quantity || 1}
                        </div>
                      </div>
                      <div className="font-bold text-amber-700">
                        $
                        {parseFloat(item.BookingExtraService?.subtotal) ||
                          parseFloat(item.price)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-amber-200">
                  <span className="font-semibold text-gray-900">
                    Services Total
                  </span>
                  <span className="text-xl font-bold text-amber-700">
                    $
                    {booking.extraServices.reduce(
                      (sum, item) =>
                        sum +
                        (parseFloat(item.BookingExtraService?.subtotal) ||
                          parseFloat(item.price)),
                      0,
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Guest Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Guest Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Name</div>
                    <div className="font-semibold text-gray-900">
                      {booking.user?.fullName || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Email</div>
                    <div className="font-semibold text-gray-900">
                      {booking.user?.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

              {booking.payment && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-amber-100">Payment Method</span>
                    <span className="font-semibold">
                      {booking.payment.paymentMethod?.methodName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-100">Payment Status</span>
                    <span className="font-semibold">
                      {getStatusText(booking.payment.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-100">Transaction Time</span>
                    <span className="font-semibold text-sm">
                      {new Date(
                        booking.payment.transactionTime,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t border-amber-400 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total Amount</span>
                  <span className="text-3xl font-bold">
                    ${parseFloat(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>

              <div className="space-y-3">
                {booking.status === 'pending' && (
                  <button
                    onClick={() =>
                      navigate(`/booking/${booking.room?.roomTypeId}`)
                    }
                    className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Modify Booking
                  </button>
                )}

                {booking.status === 'confirmed' && (
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Check In
                  </button>
                )}

                {booking.status === 'checked_in' && (
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Check Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
