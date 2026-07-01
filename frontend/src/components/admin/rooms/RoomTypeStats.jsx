import { Building2, DollarSign, Layers } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {Array<Object>} props.roomTypes
 * @returns {JSX.Element}
 */
const RoomTypeStats = ({ roomTypes }) => {
  const totalPhysicalRooms = roomTypes.reduce((sum, rt) => sum + (rt.rooms?.length || 0), 0);
  const avgBasePrice = roomTypes.length > 0 
    ? Math.round(roomTypes.reduce((sum, rt) => sum + parseFloat(rt.basePrice || 0), 0) / roomTypes.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-2xl">
              <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider">Types</span>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">Room Types</p>
          <p className="text-3xl sm:text-4xl font-light">{roomTypes.length}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-400 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-emerald-500/20 rounded-2xl">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">Rooms</span>
          </div>
          <p className="text-emerald-300 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">Physical Rooms</p>
          <p className="text-3xl sm:text-4xl font-light">{totalPhysicalRooms}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-400 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-500/20 rounded-2xl">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider">Price</span>
          </div>
          <p className="text-blue-300 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">Avg. Base Price</p>
          <p className="text-3xl sm:text-4xl font-light">${avgBasePrice}</p>
        </div>
      </div>
    </div>
  );
};

RoomTypeStats.propTypes = {
  roomTypes: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default RoomTypeStats;