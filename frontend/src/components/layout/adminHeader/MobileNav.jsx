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
    <div className="md:hidden border-t border-slate-700">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="pt-2 pb-2 border-t border-slate-700">
          <div className="px-3 py-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Management
          </div>
          {managementItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
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

        <div className="pt-4 pb-3 border-t border-slate-700 mt-3">
          <div className="px-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.fullName}</p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-3 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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