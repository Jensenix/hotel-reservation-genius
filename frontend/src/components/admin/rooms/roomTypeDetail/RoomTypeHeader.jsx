import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ArrowLeft, Plus, Layers, Bed, DollarSign, Users } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {Object} props.roomType
 * @param {string} props.roomType.name
 * @param {string|number} props.roomType.basePrice
 * @param {string|number} props.roomType.maxCapacity
 * @param {string} [props.roomType.description]
 * @param {number} props.roomsCount
 * @param {Function} props.onAddRoom
 * @returns {JSX.Element}
 */
const RoomTypeHeader = ({ roomType, roomsCount, onAddRoom }) => {
  return (
    <>
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
            <Link to="/admin/rooms" className="shrink-0 mt-1 sm:mt-0">
              <Button className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                <span className="text-amber-600 text-[10px] sm:text-xs font-semibold tracking-widest uppercase truncate">
                  Room Type Details
                </span>
                <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-1 sm:mb-2 tracking-tight break-words">
                {roomType.name}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm tracking-wide">
                Physical Rooms Management
              </p>
            </div>
          </div>
          <Button
            onClick={() => onAddRoom()}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Physical Room
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8 mb-8 sm:mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 sm:-mr-20 sm:-mt-20"></div>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                  Room Type
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-light truncate">
                  {roomType.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-emerald-400">
                <Bed className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-emerald-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                  Physical Rooms
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-light">
                  {roomsCount}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-blue-400">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-blue-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                  Base Price
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-light truncate">
                  ${roomType.basePrice}/night
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-purple-400">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-purple-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                  Max Capacity
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-light truncate">
                  {roomType.maxCapacity} guests
                </p>
              </div>
            </div>
          </div>

          {roomType.description && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed break-words">
                {roomType.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

RoomTypeHeader.propTypes = {
  roomType: PropTypes.shape({
    name: PropTypes.string.isRequired,
    basePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxCapacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    description: PropTypes.string,
  }).isRequired,
  roomsCount: PropTypes.number.isRequired,
  onAddRoom: PropTypes.func.isRequired,
};

export default RoomTypeHeader;
