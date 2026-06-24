import PropTypes from 'prop-types';
import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import { Calendar, Users, Star } from 'lucide-react';
import { getStatusColor, getStatusText } from '@/utils/bookingStatusUtils';
import { formatLongDate } from '@/utils/dateUtils';

const BookingCard = ({ booking, onViewDetails, onContinuePayment, onWriteReview }) => {
  const roomInitial = booking.room?.roomType?.name?.charAt(0) || 'R';
  const maxCapacity = booking.room?.roomType?.maxCapacity;

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-300 min-h-[320px] flex flex-col cursor-pointer"
      onClick={() => onViewDetails(booking.id)}
    >
      <div className="relative h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-4xl font-bold mb-1">
              {roomInitial}
            </div>

            <div className="text-white/90 text-xs">
              {maxCapacity ? `${maxCapacity} Guests` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusText(booking.status)}
          </span>
        </div>
      </div>

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
                {formatLongDate(booking.checkInDate)} -{' '}
                {formatLongDate(booking.checkOutDate)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="w-4 h-4" />

              <span>
                Max {maxCapacity ? `${maxCapacity} guests` : 'N/A'}
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

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-amber-600">
                ${booking.totalPrice}
              </div>

              <div className="text-xs text-gray-500">
                Total Price
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {booking.status === 'pending' && (
              <Button
                size="sm"
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onContinuePayment(
                    booking.room?.roomTypeId,
                    booking.id
                  );
                }}
              >
                Continue Payment
              </Button>
            )}

            {booking.status === 'confirmed' && (
              <Button
                size="sm"
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                onClick={(e) => e.stopPropagation()}
              >
                Check In
              </Button>
            )}

            {booking.status === 'checked_in' && (
              <Button
                size="sm"
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                onClick={(e) => e.stopPropagation()}
              >
                Check Out
              </Button>
            )}

            {booking.status === 'checked_out' && (
              <Button
                size="sm"
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onWriteReview(booking.id);
                }}
              >
                <Star className="w-4 h-4 mr-1" />
                Write Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    checkInDate: PropTypes.string,
    checkOutDate: PropTypes.string,
    specialRequests: PropTypes.string,
    totalPrice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    room: PropTypes.shape({
      roomTypeId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      roomType: PropTypes.shape({
        name: PropTypes.string,
        maxCapacity: PropTypes.number,
      }),
    }),
  }).isRequired,

  onViewDetails: PropTypes.func.isRequired,
  onContinuePayment: PropTypes.func.isRequired,
  onWriteReview: PropTypes.func.isRequired,
};

export default BookingCard;