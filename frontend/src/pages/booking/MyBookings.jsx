import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '@/hooks/booking/useMyBookings';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import BookingCard from '@/components/booking/myBookings/BookingCard';
import MyBookingsFilter from '@/components/booking/myBookings/MyBookingsFilter';
import { Calendar, CheckCircle, Clock, Shield } from 'lucide-react';
import { getStatusText } from '@/utils/bookingStatusUtils';

const MyBookings = () => {
  const navigate = useNavigate();
  
  const { 
    loading, 
    filter, 
    setFilter, 
    search, 
    setSearch, 
    filteredBookings,
    handleCheckIn,
    handleCheckOut,
  } = useMyBookings();

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

        <MyBookingsFilter
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${getStatusText(filter)} bookings found`}
            </div>
            <Button onClick={() => navigate('/our-rooms')}>
              Browse Our Rooms
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={(id) => navigate(`/my-bookings/details/${id}`)}
                onContinuePayment={(roomTypeId, bookingId) =>
                  navigate(`/booking/${roomTypeId}`, { state: { bookingId } })
                }
                onWriteReview={(bookingId) =>
                  navigate('/reviews', { state: { bookingId } })
                }
                onCheckIn={handleCheckIn} 
                onCheckOut={handleCheckOut}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;