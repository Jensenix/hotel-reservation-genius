import PropTypes from 'prop-types';
import { Users, CreditCard } from 'lucide-react';

const BookingSidebar = ({ booking, onModify }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'checked_in': return 'Checked In';
      case 'checked_out': return 'Checked Out';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Guest Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
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
                {new Date(booking.payment.transactionTime).toLocaleString()}
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
              onClick={() => onModify(booking.room?.roomTypeId)}
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
  );
};

BookingSidebar.propTypes = {
  booking: PropTypes.shape({
    status: PropTypes.string,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    room: PropTypes.shape({
      roomTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    user: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string,
    }),
    payment: PropTypes.shape({
      paymentStatus: PropTypes.string,
      transactionTime: PropTypes.string,
      paymentMethod: PropTypes.shape({
        methodName: PropTypes.string,
      }),
    }),
  }).isRequired,
  onModify: PropTypes.func.isRequired,
};

export default BookingSidebar;