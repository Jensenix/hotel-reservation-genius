import PropTypes from 'prop-types';
import { MapPin, Users, Calendar, Star } from 'lucide-react';
import { formatLongDate } from '@/utils/dateUtils';

const BookingRoomInfo = ({ booking }) => {
  const roomName = booking.room?.roomType?.name || 'Room';
  const roomInitial = roomName.charAt(0) || 'R';
  const maxGuests = booking.room?.roomType?.maxCapacity;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Room Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
        <div className="relative h-48 bg-gradient-to-br from-amber-400 to-amber-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-6xl font-bold mb-2">{roomInitial}</div>
              <div className="text-white/90 text-lg">{roomName}</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{roomName}</h2>

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
                  {maxGuests ? `${maxGuests} Guests` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-100 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Room Description</h3>
            <p className="text-gray-600 text-sm">
              A comfortable and well-appointed {roomName.toLowerCase()} perfect for your
              stay. Features modern amenities and elegant decor.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Information</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <div className="text-xs text-gray-600">Check-in Date</div>
              <div className="font-semibold text-gray-900">
                {formatLongDate(booking.checkInDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <div className="text-xs text-gray-600">Check-out Date</div>
              <div className="font-semibold text-gray-900">
                {formatLongDate(booking.checkOutDate)}
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-amber-600" />
                <div className="font-semibold text-gray-900">Special Requests</div>
              </div>
              <p className="text-gray-700 text-sm">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>

      {/* Extra Services Card */}
      {booking.extraServices && booking.extraServices.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Extra Services</h2>

          <div className="space-y-3">
            {booking.extraServices.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">{item.serviceName}</div>
                  <div className="text-sm text-gray-600">
                    Quantity: {item.BookingExtraService?.quantity || 1}
                  </div>
                </div>
                <div className="font-bold text-amber-700">
                  ${parseFloat(item.BookingExtraService?.subtotal) || parseFloat(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-amber-200">
            <span className="font-semibold text-gray-900">Services Total</span>
            <span className="text-xl font-bold text-amber-700">
              $
              {booking.extraServices.reduce(
                (sum, item) =>
                  sum + (parseFloat(item.BookingExtraService?.subtotal) || parseFloat(item.price)),
                0
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

BookingRoomInfo.propTypes = {
  booking: PropTypes.shape({
    checkInDate: PropTypes.string,
    checkOutDate: PropTypes.string,
    specialRequests: PropTypes.string,
    room: PropTypes.shape({
      roomNumber: PropTypes.string,
      roomType: PropTypes.shape({
        name: PropTypes.string,
        maxCapacity: PropTypes.number,
      }),
    }),
    extraServices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        serviceName: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        BookingExtraService: PropTypes.shape({
          quantity: PropTypes.number,
          subtotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      })
    ),
  }).isRequired,
};

export default BookingRoomInfo;