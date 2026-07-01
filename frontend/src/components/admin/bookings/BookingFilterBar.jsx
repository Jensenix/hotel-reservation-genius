import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';

/**
 * @param {Object} props
 * @param {Object} props.filters
 * @param {string} props.filters.status
 * @param {string} props.filters.search
 * @param {Function} props.handleFilterChange
 * @param {Function} props.fetchBookings
 * @param {React.RefObject<HTMLInputElement>} [props.searchInputRef]
 * @returns {JSX.Element}
 */
export default function BookingFilterBar({
  filters,
  handleFilterChange,
  fetchBookings,
  searchInputRef,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-end">
        <div className="w-full md:flex-1 min-w-[200px]">
          <label
            htmlFor="statusFilter"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
          >
            Status Filter
          </label>
          <select
            id="statusFilter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="w-full md:flex-1 min-w-[200px]">
          <label
            htmlFor="searchInput"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
          >
            Search
          </label>
          <input
            ref={searchInputRef}
            id="searchInput"
            type="text"
            placeholder="Search by name or ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-auto">
          <Button
            onClick={() => fetchBookings()}
            className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

BookingFilterBar.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  fetchBookings: PropTypes.func.isRequired,
  searchInputRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};
