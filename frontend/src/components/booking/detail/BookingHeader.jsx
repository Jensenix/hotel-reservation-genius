import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingHeader = ({ bookingId, status, onBack }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
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
          <p className="text-gray-600">Booking #{bookingId}</p>
        </div>
        <BookingStatusBadge status={status} />
      </div>
    </div>
  );
};

BookingHeader.propTypes = {
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default BookingHeader;