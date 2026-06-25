import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MobileNav = ({
  isOpen,
  onClose,
  adminNavItems,
  managementItems,
  isActive,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="xl:hidden border-t border-slate-700 bg-slate-900 absolute top-full left-0 w-full shadow-2xl">
      <div className="px-4 pt-2 pb-4 space-y-1 max-h-[80vh] overflow-y-auto">
        {adminNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="pt-4 pb-2 border-t border-slate-700 mt-2">
          <div className="px-3 py-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Management
          </div>
          {managementItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
        </div>

        <div className="pt-4 pb-3 border-t border-slate-700 mt-4">
          <div className="px-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.fullName || 'Admin User'}</p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="mt-4 w-full px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

MobileNav.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    adminNavItems: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
        })
    ).isRequired,
    managementItems: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
        })
    ).isRequired,
    isActive: PropTypes.func.isRequired,
    user: PropTypes.shape({
        fullName: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
};

export default MobileNav;