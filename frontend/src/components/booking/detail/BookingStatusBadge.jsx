import PropTypes from 'prop-types';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string} props.status
 * @returns {JSX.Element}
 */
const BookingStatusBadge = ({ status }) => {
  const getBadgeConfig = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          text: 'Pending',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          text: 'Confirmed',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'checked_in':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          text: 'Checked In',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'checked_out':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          text: 'Checked Out',
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          text: 'Cancelled',
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          text: currentStatus,
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${config.color}`}
    >
      {config.icon}
      <span className="font-medium">{config.text}</span>
    </div>
  );
};

BookingStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default BookingStatusBadge;
