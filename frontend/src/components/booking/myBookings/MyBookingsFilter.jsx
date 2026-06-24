import PropTypes from 'prop-types';
import { Search, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getStatusText } from '@/utils/bookingStatusUtils';

const TABS = ['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

const MyBookingsFilter = ({ search, setSearch, filter, setFilter }) => {
  return (
    <section className="py-8 bg-white border-y border-amber-100">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Filter Bookings</h2>
              <p className="text-gray-600">Quickly find your reservations by status</p>
            </div>
            <div className="w-full md:w-auto relative">
              <label htmlFor="searchBookings" className="sr-only">
                Search bookings
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="searchBookings"
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 font-medium text-sm rounded-lg border-2 transition-all duration-200 ${
                  filter === status
                    ? 'bg-amber-600 text-white border-amber-600 shadow-lg'
                    : 'bg-white text-gray-700 border-amber-300 hover:bg-amber-50 hover:border-amber-400'
                }`}
                aria-pressed={filter === status}
              >
                <div className="flex items-center space-x-2">
                  {status === 'all' && <Filter className="w-4 h-4" />}
                  {status === 'pending' && <AlertCircle className="w-4 h-4" />}
                  {['confirmed', 'checked_in', 'checked_out'].includes(status) && <CheckCircle className="w-4 h-4" />}
                  {status === 'cancelled' && <XCircle className="w-4 h-4" />}
                  <span>{status === 'all' ? 'All Bookings' : getStatusText(status)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

MyBookingsFilter.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};

export default MyBookingsFilter;