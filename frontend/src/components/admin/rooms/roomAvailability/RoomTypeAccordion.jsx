import PropTypes from 'prop-types';
import { getStatusBadge, getStatusColor } from '@/utils/availabilityUtils';

/**
 * @param {Object} props
 * @param {Array<Object>} props.roomTypes
 * @param {string|null} [props.expandedRoomType]
 * @param {Function} props.onToggle
 * @returns {JSX.Element}
 */
const RoomTypeAccordion = ({ roomTypes, expandedRoomType, onToggle }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">
          Availability by Room Type
        </h2>
        <p className="text-sm text-slate-500">
          Detailed room status by category
        </p>
      </div>

      {roomTypes.map((roomType) => {
        const isExpanded = expandedRoomType === roomType.roomTypeName;

        return (
          <div
            key={roomType.roomTypeName}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
          >
            <button
              type="button"
              className="w-full flex flex-col lg:flex-row lg:items-center justify-between cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-4 rounded-lg transition-shadow gap-4"
              onClick={() => onToggle(roomType.roomTypeName)}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="p-3 bg-slate-100 rounded-lg shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                    {roomType.roomTypeName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {roomType.totalRooms} rooms total
                  </p>
                </div>
                {/* Mobile dropdown arrow indicator */}
                <svg
                  className={`lg:hidden ml-auto w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 w-full lg:w-auto border-t lg:border-0 pt-4 lg:pt-0 border-slate-100">
                <div className="text-center sm:text-left lg:text-center bg-slate-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                    {roomType.availableRooms}
                  </p>
                  <p className="text-xs text-slate-500">Available</p>
                </div>
                <div className="text-center sm:text-left lg:text-center bg-slate-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-slate-600">
                    {roomType.occupiedRooms}
                  </p>
                  <p className="text-xs text-slate-500">Occupied</p>
                </div>
                <div className="text-center sm:text-left lg:text-center bg-slate-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">
                    {roomType.maintenanceRooms}
                  </p>
                  <p className="text-xs text-slate-500">Maintenance</p>
                </div>
                <div className="text-center sm:text-left lg:text-center bg-slate-50 lg:bg-transparent p-2 lg:p-0 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    {roomType.cleaningRooms}
                  </p>
                  <p className="text-xs text-slate-500">Cleaning</p>
                </div>
                {/* Desktop dropdown arrow indicator */}
                <svg
                  className={`hidden lg:block w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {roomType.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-slate-800 truncate">
                          {room.roomNumber}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {getStatusBadge(room.status)}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor(room.status).split(' ')[0]}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

RoomTypeAccordion.propTypes = {
  roomTypes: PropTypes.arrayOf(
    PropTypes.shape({
      roomTypeName: PropTypes.string.isRequired,
      totalRooms: PropTypes.number.isRequired,
      availableRooms: PropTypes.number.isRequired,
      occupiedRooms: PropTypes.number.isRequired,
      maintenanceRooms: PropTypes.number.isRequired,
      cleaningRooms: PropTypes.number.isRequired,
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          roomNumber: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  expandedRoomType: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

export default RoomTypeAccordion;
