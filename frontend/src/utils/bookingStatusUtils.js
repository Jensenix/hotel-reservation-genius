/**
 *
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'checked_in':
      return 'bg-blue-100 text-blue-800';
    case 'checked_out':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 *
 * @param {string} status
 * @returns {string}
 */
export const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'checked_in':
      return 'Checked In';
    case 'checked_out':
      return 'Checked Out';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
