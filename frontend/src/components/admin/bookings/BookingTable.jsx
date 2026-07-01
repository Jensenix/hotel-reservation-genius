import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array<Object>} props.bookings
 * @param {Function} props.getStatusBadge
 * @param {Function} props.onViewDetails
 * @param {Function} props.onAction
 * @returns {JSX.Element}
 */
export default function BookingTable({
  bookings,
  getStatusBadge,
  onViewDetails,
  onAction,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('');

  const getActionButtons = (booking) => {
    const buttons = [];

    const handleActionClick = (e, actionType) => {
      e.stopPropagation();
      onAction(booking, actionType);
    };

    if (booking.status === 'pending') {
      buttons.push(
        <Button
          key="confirm"
          size="sm"
          onClick={(e) => handleActionClick(e, 'confirm')}
          className="mr-2"
        >
          Confirm
        </Button>,
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          onClick={(e) => handleActionClick(e, 'cancel')}
        >
          Cancel
        </Button>,
      );
    }

    if (booking.status === 'confirmed') {
      buttons.push(
        <Button
          key="check-in"
          size="sm"
          onClick={(e) => handleActionClick(e, 'check-in')}
        >
          Check In
        </Button>,
      );
    }

    if (booking.status === 'checked_in' || booking.status === 'checked-in') {
      buttons.push(
        <Button
          key="check-out"
          size="sm"
          onClick={(e) => handleActionClick(e, 'check-out')}
        >
          Check Out
        </Button>,
      );
    }

    return buttons;
  };

  const columns = [
    {
      label: 'Booking ID',
      sortKey: 'id',
      render: (booking) => (
        <span className="font-medium text-gray-900">#{booking.id}</span>
      ),
    },
    {
      label: 'Guest',
      sortKey: 'guest',
      render: (booking) => (
        <div>
          <div className="font-medium text-gray-900">
            {booking.user?.fullName || 'N/A'}
          </div>
          <div className="text-gray-500 text-sm">
            {booking.user?.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      label: 'Room',
      sortKey: 'room',
      render: (booking) => (
        <div>
          <div className="font-medium text-gray-900">
            Room {booking.room?.roomNumber || 'N/A'}
          </div>
          <div className="text-gray-500 text-sm">
            {booking.room?.roomType?.name || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      label: 'Dates',
      type: 'select-sort',
      options: [
        { label: 'DATES (ALL)', value: '' },
        { label: 'NEWEST FIRST', value: 'desc' },
        { label: 'OLDEST FIRST', value: 'asc' },
      ],
      render: (booking) => (
        <div className="text-sm text-gray-900">
          <div>In: {new Date(booking.checkInDate).toLocaleDateString()}</div>
          <div>Out: {new Date(booking.checkOutDate).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      label: 'Total',
      sortKey: 'total',
      render: (booking) => (
        <span className="font-medium text-gray-900">
          ${parseFloat(booking.totalPrice).toFixed(2)}
        </span>
      ),
    },
    {
      label: 'Status',
      type: 'select-filter',
      options: [
        { label: 'ALL STATUS', value: '' },
        { label: 'PENDING', value: 'pending' },
        { label: 'CONFIRMED', value: 'confirmed' },
        { label: 'CHECKED IN', value: 'checked_in' },
        { label: 'CHECKED OUT', value: 'checked_out' },
        { label: 'CANCELLED', value: 'cancelled' },
      ],
      render: (booking) => getStatusBadge(booking.status),
    },
    {
      label: 'Actions',
      sortKey: null,
      render: (booking) => (
        <div className="flex items-center space-x-2">
          {getActionButtons(booking)}
        </div>
      ),
    },
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (column) => {
    if (sortConfig.key !== column.sortKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-300" />;
    }

    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-amber-600" />;
    }

    return <ChevronDown className="w-4 h-4 text-amber-600" />;
  };

  const renderHeaderContent = (column) => {
    if (column.type === 'select-sort') {
      return (
        <select
          className="bg-transparent border border-gray-300 rounded px-2 py-1 outline-none text-xs font-semibold text-gray-600 cursor-pointer hover:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase tracking-wider"
          onClick={(e) => e.stopPropagation()}
          value={sortConfig.key === 'dates' ? sortConfig.direction : ''}
          onChange={(e) => {
            if (e.target.value) {
              setSortConfig({ key: 'dates', direction: e.target.value });
            } else {
              setSortConfig({ key: null, direction: 'asc' });
            }
          }}
        >
          {column.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (column.type === 'select-filter') {
      return (
        <select
          className="bg-transparent border border-gray-300 rounded px-2 py-1 outline-none text-xs font-semibold text-gray-600 cursor-pointer hover:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase tracking-wider"
          onClick={(e) => e.stopPropagation()}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {column.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {column.label}
        {column.sortKey && (
          <span className="flex flex-col">{renderSortIcon(column)}</span>
        )}
      </div>
    );
  };

  const processedBookings = useMemo(() => {
    // 1. Process Status Filter
    let result = bookings;
    if (statusFilter) {
      result = result.filter(
        (b) =>
          b.status === statusFilter ||
          b.status.replace('-', '_') === statusFilter,
      );
    }

    // 2. Process Sorting
    if (!sortConfig.key) return result;

    return [...result].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'guest':
          aValue = (a.user?.fullName || '').toLowerCase();
          bValue = (b.user?.fullName || '').toLowerCase();
          break;
        case 'room':
          aValue = a.room?.roomNumber || '';
          bValue = b.room?.roomNumber || '';
          break;
        case 'dates':
          aValue = new Date(a.checkInDate).getTime();
          bValue = new Date(b.checkInDate).getTime();
          break;
        case 'total':
          aValue = Number(a.totalPrice);
          bValue = Number(b.totalPrice);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bookings, sortConfig, statusFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.label}
                  onClick={() => {
                    if (column.sortKey) handleSort(column.sortKey);
                  }}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                    column.sortKey
                      ? 'cursor-pointer hover:bg-gray-100 select-none transition-colors'
                      : ''
                  }`}
                >
                  {renderHeaderContent(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => onViewDetails(booking)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewDetails(booking);
                  }
                }}
                tabIndex={0}
                className="hover:bg-slate-50 cursor-pointer transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={column.label}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render(booking)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {processedBookings.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No bookings found matching your criteria.
        </div>
      )}
    </div>
  );
}

BookingTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};
