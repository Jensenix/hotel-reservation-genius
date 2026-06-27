import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

export default function GuestFilterBar({ searchTerm, setSearchTerm, roleFilter, setRoleFilter }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-2">
          <label htmlFor="searchInput" className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Search Users</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              id="searchInput"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
        <div>
          <label htmlFor="roleFilter" className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Filter by Role</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>
    </div>
  );
}

GuestFilterBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  roleFilter: PropTypes.string.isRequired,
  setRoleFilter: PropTypes.func.isRequired,
};