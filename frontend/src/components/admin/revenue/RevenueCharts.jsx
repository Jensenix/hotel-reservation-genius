import { formatCurrency } from '@/utils/formatters';
import PropTypes from 'prop-types';

const RevenueCharts = ({ revenueData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Monthly Revenue Trend</h3>
          <p className="text-sm text-slate-500">Revenue distribution by month (from payment date range)</p>
        </div>
        <div className="space-y-3">
          {revenueData.revenueByMonth.length > 0 ? (
            revenueData.revenueByMonth.map((item, index) => {
              const maxRevenue = Math.max(...revenueData.revenueByMonth.map((i) => i.revenue));
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.month}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 min-w-[80px] text-right">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">
              No revenue data available for selected payment period
            </p>
          )}
        </div>
      </div>

      {/* Revenue by Room Type */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Revenue by Room Type</h3>
          <p className="text-sm text-slate-500">Revenue breakdown by room category (from payment date range)</p>
        </div>
        <div className="space-y-3">
          {revenueData.revenueByRoomType && revenueData.revenueByRoomType.length > 0 ? (
            revenueData.revenueByRoomType.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.type}</p>
                  <p className="text-sm text-slate-500">{item.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-slate-500">
                    {item.bookings > 0 ? formatCurrency(Math.round(item.revenue / item.bookings)) : formatCurrency(0)}{' '}
                    avg
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 mb-2">No room type revenue data available</p>
              <p className="text-xs text-slate-400">
                Try adjusting the payment date range or check if there are paid bookings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RevenueCharts.propTypes = {
  revenueData: PropTypes.shape({
    revenueByMonth: PropTypes.arrayOf(
        PropTypes.shape({
            month: PropTypes.string.isRequired,
            revenue: PropTypes.number.isRequired,
        })
    ).isRequired,
    revenueByRoomType: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            revenue: PropTypes.number.isRequired,
            bookings: PropTypes.number.isRequired,
        })
    ).isRequired,
  }).isRequired,
};

export default RevenueCharts;