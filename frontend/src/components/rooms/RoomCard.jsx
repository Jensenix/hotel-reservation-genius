import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, Wifi, ChevronRight, Heart, Calendar, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { MaxStayDays } from '@/config';
import { getLocalYYYYMMDD } from '@/utils/dateUtils';

/**
 * @param {Object} props
 * @param {Object} props.room
 * @param {string|number} props.room.id
 * @param {string} props.room.name
 * @param {string} [props.room.description]
 * @param {Array<Object>} [props.room.facilities]
 * @param {number} [props.room.maxCapacity]
 * @param {string|number} [props.room.basePrice]
 * @returns {JSX.Element}
 */
const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Modal State for when dates are missing
  const [showDatePrompt, setShowDatePrompt] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState('');
  const [tempCheckOut, setTempCheckOut] = useState('');

  const handleBookNowClick = () => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (checkIn && checkOut) {
      // Dates exist globally, proceed directly to booking
      navigate(`/booking/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}`);
    } else {
      // No dates selected (user was "Just Browsing"), prompt them now
      setShowDatePrompt(true);
    }
  };

  const handleModalSubmit = () => {
    if (tempCheckIn && tempCheckOut) {
      setShowDatePrompt(false);
      navigate(
        `/booking/${room.id}?checkIn=${tempCheckIn}&checkOut=${tempCheckOut}`,
      );
    }
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setTempCheckIn(newCheckIn);

    if (tempCheckOut) {
      const checkInDate = new Date(newCheckIn);
      const checkOutDate = new Date(tempCheckOut);
      const diffDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
      );

      if (diffDays <= 0 || diffDays > MaxStayDays) {
        setTempCheckOut('');
      }
    }
  };

  // STRICT UX VALIDATION: Catch manual typing bypasses
  const handleCheckOutChange = (e) => {
    let newCheckOut = e.target.value;

    if (tempCheckIn && newCheckOut) {
      const checkInDate = new Date(tempCheckIn);
      let checkOutDate = new Date(newCheckOut);

      const diffDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
      );

      if (diffDays <= 0) {
        checkOutDate = new Date(checkInDate.getTime() + 86400000);
        newCheckOut = getLocalYYYYMMDD(checkOutDate);
      } else if (diffDays > MaxStayDays) {
        checkOutDate = new Date(checkInDate.getTime() + MaxStayDays * 86400000);
        newCheckOut = getLocalYYYYMMDD(checkOutDate);
        alert(`Bookings are limited to a maximum of ${MaxStayDays} nights.`);
      }
    }

    setTempCheckOut(newCheckOut);
  };

  const todayStr = getLocalYYYYMMDD(new Date());

  const minCheckOutStr = tempCheckIn
    ? getLocalYYYYMMDD(new Date(new Date(tempCheckIn).getTime() + 86400000))
    : todayStr;

  const maxCheckOutStr = tempCheckIn
    ? getLocalYYYYMMDD(
        new Date(new Date(tempCheckIn).getTime() + MaxStayDays * 86400000),
      )
    : undefined;

  return (
    <>
      <Card
        hover={true}
        className="overflow-hidden group h-full flex flex-col relative"
      >
        <div className="relative h-64 bg-gradient-to-br from-amber-400 to-amber-600 mb-6 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-6xl font-bold mb-2">
                {room.name.charAt(0)}
              </div>
              <div className="text-white/90 text-sm">
                {room.maxCapacity} Guests
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs font-medium">${room.basePrice}/night</span>
          </div>
        </div>

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between flex-shrink-0">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {room.name}
              </h3>
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {room.description?.length > 150
                  ? `${room.description.substring(0, 150)}...`
                  : room.description}
              </p>
            </div>
            <button
              className="p-2 rounded-full hover:bg-amber-50 transition-colors duration-200 ml-2 flex-shrink-0"
              aria-label="Favorite room"
            >
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 flex-shrink-0 min-h-[40px]">
            {(room.facilities || []).slice(0, 3).map((facility) => (
              <div
                key={facility.id}
                className="flex items-center px-3 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-colors duration-200"
                title={facility.facilityName}
              >
                <Wifi className="w-4 h-4 mr-1" />
                {facility.facilityName}
              </div>
            ))}
            {(room.facilities || []).length > 3 && (
              <div className="flex items-center px-3 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                +{(room.facilities || []).length - 3} more
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-amber-100 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">Max {room.maxCapacity} guests</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-600">
                ${room.basePrice}
              </div>
              <span className="text-gray-500 text-sm">/night</span>
            </div>
          </div>

          <div className="pt-4 space-y-3 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-lg"
              onClick={handleBookNowClick}
            >
              Book Now
              <ChevronRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Localized Date Prompt Modal */}
      {showDatePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowDatePrompt(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 mt-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Select Stay Dates
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please select your dates to check {room.name}&apos;s
                availability.
              </p>
            </div>

            <div className="space-y-4 mb-6 relative">
              <div>
                <label
                  htmlFor={`checkIn-${room.id}`}
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Check-in Date
                </label>
                <input
                  id={`checkIn-${room.id}`}
                  type="date"
                  min={todayStr}
                  value={tempCheckIn}
                  onChange={handleCheckInChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label
                    htmlFor={`checkOut-${room.id}`}
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Check-out Date
                  </label>
                  {tempCheckIn && (
                    <span className="text-[10px] text-gray-500">
                      Max stay: {MaxStayDays} nights
                    </span>
                  )}
                </div>
                <input
                  id={`checkOut-${room.id}`}
                  type="date"
                  disabled={!tempCheckIn}
                  min={minCheckOutStr}
                  max={maxCheckOutStr}
                  value={tempCheckOut}
                  onChange={handleCheckOutChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <Button
              onClick={handleModalSubmit}
              disabled={!tempCheckIn || !tempCheckOut}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold flex justify-center items-center"
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    facilities: PropTypes.arrayOf(PropTypes.object),
    maxCapacity: PropTypes.number,
    basePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default RoomCard;
