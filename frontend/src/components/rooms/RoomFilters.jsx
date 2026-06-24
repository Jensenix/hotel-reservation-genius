import { Search, Filter, Users, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';

const RoomFilters = ({ filters, updateFilters, clearFilters }) => {
  return (
    <section className="py-12 bg-white border-y border-amber-100">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Find Your Perfect Room
              </h2>
              <p className="text-gray-600">
                Search and filter our luxurious accommodations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <label htmlFor="searchRooms" className="sr-only">
                  Search rooms
                </label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="searchRooms"
                  type="text"
                  placeholder="Search rooms..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-4 border border-amber-200">
              <label
                htmlFor="filterCapacity"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <Users className="w-4 h-4 mr-2 text-amber-600" />
                Capacity
              </label>
              <select
                id="filterCapacity"
                value={filters.capacity}
                onChange={(e) => updateFilters({ capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Capacities</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-4 border border-amber-200">
              <label
                htmlFor="filterPrice"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                Price Range
              </label>
              <select
                id="filterPrice"
                value={filters.priceRange}
                onChange={(e) => updateFilters({ priceRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Prices</option>
                <option value="budget">Budget ($0-$100)</option>
                <option value="mid">Mid-Range ($100-$200)</option>
                <option value="luxury">Luxury ($200+)</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-4 border border-amber-200">
              <label
                htmlFor="filterSort"
                className="text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <Filter className="w-4 h-4 mr-2 text-amber-600" />
                Sort By
              </label>
              <select
                id="filterSort"
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

RoomFilters.propTypes = {
  filters: PropTypes.shape({
    capacity: PropTypes.string,
    priceRange: PropTypes.string,
    sortBy: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  updateFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default RoomFilters;
