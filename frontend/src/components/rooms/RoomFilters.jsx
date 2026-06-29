import { Search, Users, DollarSign, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';
import { MaxStayDays } from '@/config';

const RoomFilters = ({ filters, updateFilters, clearFilters }) => {
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    const updates = { checkIn: newCheckIn };
    
    if (filters.checkOut) {
      const checkInDate = new Date(newCheckIn);
      const checkOutDate = new Date(filters.checkOut);
      const diffTime = checkOutDate - checkInDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0 || diffDays > MaxStayDays) {
        updates.checkOut = ''; 
      }
    }
    updateFilters(updates);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  
  const maxCheckOutStr = filters.checkIn 
    ? new Date(new Date(filters.checkIn).getTime() + (MaxStayDays * 86400000)).toISOString().split('T')[0]
    : undefined;

  return (
    <section className="py-8 bg-white border-y border-amber-100">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            <div className="md:col-span-3">
              <label htmlFor="searchFilter" className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 uppercase">
                <Search className="w-3.5 h-3.5 text-amber-600" /> Search
              </label>
              <input
                id="searchFilter"
                type="text"
                placeholder="Search rooms..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="checkInFilter" className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 uppercase">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check In
              </label>
              <input
                id="checkInFilter"
                type="date"
                min={todayStr}
                value={filters.checkIn}
                onChange={handleCheckInChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="checkOutFilter" className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 uppercase">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Check Out
              </label>
              <input
                id="checkOutFilter"
                type="date"
                disabled={!filters.checkIn}
                min={filters.checkIn ? new Date(new Date(filters.checkIn).getTime() + 86400000).toISOString().split('T')[0] : todayStr}
                max={maxCheckOutStr}
                value={filters.checkOut}
                onChange={(e) => updateFilters({ checkOut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white disabled:bg-gray-50"
              />
              {filters.checkIn && <p className="text-[10px] text-gray-500 mt-1 absolute">Max stay: {MaxStayDays} nights</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="capacityFilter" className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 uppercase">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Capacity
              </label>
              <select
                id="capacityFilter"
                value={filters.capacity}
                onChange={(e) => updateFilters({ capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">Any</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="priceFilter" className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 uppercase">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Price
              </label>
              <select
                id="priceFilter"
                value={filters.priceRange}
                onChange={(e) => updateFilters({ priceRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">Any</option>
                <option value="budget">Budget (≤ $100)</option>
                <option value="mid">Mid ($100-$200)</option>
                <option value="luxury">Luxury (+$200)</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full py-2 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Clear
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

RoomFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  updateFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default RoomFilters;