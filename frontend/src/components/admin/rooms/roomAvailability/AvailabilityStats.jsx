import PropTypes from 'prop-types';

const AvailabilityStats = ({ overall }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Rooms */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Total</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Rooms</p>
          <p className="text-3xl font-light text-white">{overall.totalRooms}</p>
          <p className="text-sm text-slate-400 mt-1">All rooms</p>
        </div>
      </div>

      {/* Available Rooms */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 border border-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Available</span>
          </div>
          <p className="text-emerald-100 text-xs uppercase tracking-wider mb-1">Available Rooms</p>
          <p className="text-3xl font-light text-white">{overall.availableRooms}</p>
          <p className="text-sm text-emerald-100 mt-1">{overall.availabilityRate}% available</p>
        </div>
      </div>

      {/* Occupied Rooms */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Occupied</span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Occupied Rooms</p>
          <p className="text-3xl font-light text-white">{overall.occupiedRooms}</p>
          <p className="text-sm text-slate-400 mt-1">{overall.occupancyRate}% occupied</p>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Maintenance</span>
          </div>
          <p className="text-amber-100 text-xs uppercase tracking-wider mb-1">Under Repair</p>
          <p className="text-3xl font-light text-white">{overall.maintenanceRooms}</p>
          <p className="text-sm text-amber-100 mt-1">Under repair</p>
        </div>
      </div>
    </div>
  );
};

AvailabilityStats.propTypes = {
  overall: PropTypes.shape({
    totalRooms: PropTypes.number.isRequired,
    availableRooms: PropTypes.number.isRequired,
    availabilityRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    occupiedRooms: PropTypes.number.isRequired,
    occupancyRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    maintenanceRooms: PropTypes.number.isRequired,
  }).isRequired,
};

export default AvailabilityStats;