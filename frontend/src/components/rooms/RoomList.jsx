import Button from '@/components/common/Button';
import RoomCard from './RoomCard';
import PropTypes from 'prop-types';

const RoomList = ({ rooms, clearFilters }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Available Rooms
              <span className="ml-3 text-xl font-normal text-gray-600">
                ({rooms.length} rooms)
              </span>
            </h2>
            <p className="text-gray-600">
              Luxury accommodations tailored for your comfort
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-xl mb-4">
              No rooms found matching your criteria
            </div>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more options
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearFilters: PropTypes.func.isRequired
};

export default RoomList;