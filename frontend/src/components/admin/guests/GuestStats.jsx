import { Users as UsersIcon, Shield, User } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {Array<Object>} props.users
 * @returns {JSX.Element}
 */
export default function GuestStats({ users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-amber-500/20 rounded-2xl">
              <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">
            Total Users
          </p>
          <p className="text-3xl sm:text-4xl font-light">{users.length}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-2xl shadow-2xl border border-purple-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-400 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-purple-500/20 rounded-2xl">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Admins
            </span>
          </div>
          <p className="text-purple-300 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">
            Administrators
          </p>
          <p className="text-3xl sm:text-4xl font-light">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-400 opacity-10 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-blue-500/20 rounded-2xl">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Guests
            </span>
          </div>
          <p className="text-blue-300 text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2">
            Registered Guests
          </p>
          <p className="text-3xl sm:text-4xl font-light">
            {users.filter((u) => u.role === 'guest').length}
          </p>
        </div>
      </div>
    </div>
  );
}

GuestStats.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
