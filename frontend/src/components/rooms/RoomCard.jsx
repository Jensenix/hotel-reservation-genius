import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import { Users, Wifi, MapPin, ChevronRight, Heart } from 'lucide-react';
import PropTypes from 'prop-types';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <Card hover={true} className="overflow-hidden group h-full flex flex-col">
      <div className="relative h-64 bg-gradient-to-br from-amber-400 to-amber-600 mb-6 overflow-hidden rounded-2xl">
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
          <span className="text-xs font-medium">
            ${room.basePrice}/night
          </span>
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
          <button className="p-2 rounded-full hover:bg-amber-50 transition-colors duration-200 ml-2 flex-shrink-0">
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
              <span className="text-sm">
                Max {room.maxCapacity} guests
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                Floor {room.floor || '1'}
              </span>
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
            onClick={() => navigate(`/booking/${room.id}`)}
          >
            Book Now
            <ChevronRight className="w-5 h-5 ml-2 inline" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    facilities: PropTypes.arrayOf(PropTypes.object),
    maxCapacity: PropTypes.number,
    floor: PropTypes.string,
    basePrice: PropTypes.number
  }).isRequired
};

export default RoomCard;