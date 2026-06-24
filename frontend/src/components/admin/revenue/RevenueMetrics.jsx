import { formatCurrency } from '@/utils/formatters';
import PropTypes from 'prop-types';

const RevenueMetrics = ({ revenueData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-light text-white">
            {formatCurrency(revenueData.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Total Bookings */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <svg
                className="w-6 h-6 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Bookings
            </span>
          </div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Total Bookings
          </p>
          <p className="text-3xl font-light text-white">
            {revenueData.totalBookings}
          </p>
        </div>
      </div>

      {/* Top Room Type */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Top
            </span>
          </div>
          <p className="text-amber-100 text-xs uppercase tracking-wider mb-1">
            Top Room Type
          </p>
          <p className="text-2xl font-semibold text-white mb-1">
            {revenueData.revenueByRoomType?.[0]?.type || 'N/A'}
          </p>
          <p className="text-sm text-amber-100">
            {formatCurrency(revenueData.revenueByRoomType?.[0]?.revenue || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

RevenueMetrics.propTypes = {
  revenueData: PropTypes.shape({
    totalRevenue: PropTypes.number.isRequired,
    totalBookings: PropTypes.number.isRequired,
    revenueByRoomType: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            revenue: PropTypes.number.isRequired,
        })
    ).isRequired,
  }).isRequired,
};

export default RevenueMetrics;
