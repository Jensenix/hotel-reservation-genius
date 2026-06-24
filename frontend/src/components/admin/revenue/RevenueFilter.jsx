import Button from '@/components/common/Button';
import PropTypes from 'prop-types';

const RevenueFilter = ({ dateRange, setDateRange, onApplyFilter }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="paymentStartDate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Payment Start Date
          </label>
          <input
            id="paymentStartDate"
            type="date"
            value={dateRange.startDate.toLocaleDateString('en-CA')}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                startDate: new Date(e.target.value),
              }))
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="paymentEndDate" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Payment End Date
          </label>
          <input
            id="paymentEndDate"
            type="date"
            value={dateRange.endDate.toLocaleDateString('en-CA')}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                endDate: new Date(e.target.value),
              }))
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
          />
        </div>
        <div>
          <Button
            onClick={onApplyFilter}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

RevenueFilter.propTypes = {
  dateRange: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  setDateRange: PropTypes.func.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
};

export default RevenueFilter;