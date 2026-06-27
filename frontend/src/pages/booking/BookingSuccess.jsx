import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const room = location.state?.room;

  if (!booking || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find your booking details.
          </p>
          <Button onClick={() => navigate('/our-rooms')}>
            Browse Our Rooms
          </Button>
        </div>
      </div>
    );
  }

  const handleNewBooking = () => {
    navigate('/our-rooms');
  };

  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your reservation has been successfully confirmed. We&apos;ve sent a
            confirmation email with all the details.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Booking Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Room Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Room Type:</span>
                  <span className="font-medium">{room.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Capacity:</span>
                  <span className="font-medium">{room.maxCapacity} guests</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Price/night:</span>
                  <span className="font-medium">${room.basePrice}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Reservation Dates
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Check-in:</span>
                  <span className="font-medium">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Check-out:</span>
                  <span className="font-medium">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Guests:</span>
                  <span className="font-medium">{booking.guestCount || 1}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">Total Price:</span>
                  <span className="font-bold text-xl text-green-600">
                    ${booking.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Special Requests
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {booking.specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleNewBooking}
            variant="outline"
            className="flex-1"
          >
            Make Another Booking
          </Button>
          <Button onClick={handleViewBookings} className="flex-1">
            View My Bookings
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">
              What&apos;s Next?
            </h3>
            <p className="text-blue-700 mb-4">
              Check your email for booking confirmation. You can also manage
              your reservations through your account dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm">
                Download Receipt
              </Button>
              <Button variant="outline" size="sm">
                Add to Calendar
              </Button>
              <Button size="sm">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
