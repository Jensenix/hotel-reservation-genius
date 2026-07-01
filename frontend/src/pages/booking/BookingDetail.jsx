import { useBookingDetail } from '@/hooks/booking/useBookingDetail';
import BookingHeader from '@/components/booking/detail/BookingHeader';
import BookingRoomInfo from '@/components/booking/detail/BookingRoomInfo';
import BookingSidebar from '@/components/booking/detail/BookingSidebar';

/**
 * @returns {JSX.Element}
 */
const BookingDetail = () => {
  const {
    booking,
    loading,
    goBack,
    goToModify,
    handleContinuePayment,
    handleCheckOut,
    handleCheckIn,
    handleCancel,
  } = useBookingDetail();

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
              onClick={goBack}
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
        <BookingHeader
          bookingId={booking.id}
          status={booking.status}
          onBack={goBack}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BookingRoomInfo booking={booking} />
          <BookingSidebar
            booking={booking}
            onModify={goToModify}
            onContinuePayment={handleContinuePayment}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
