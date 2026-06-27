import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';

export default function BookingTable({
  bookings,
  getStatusBadge,
  onViewDetails,
  onAction,
}) {
  
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
        </Button>
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
        </Button>
      );
    }

    if (booking.status === 'checked-in') {
      buttons.push(
        <Button
          key="check-out"
          size="sm"
          onClick={(e) => handleActionClick(e, 'check-out')}
        >
          Check Out
        </Button>
      );
    }

    return buttons;
  };

  const tableHeaderStyle =
    "px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider";

  const columns = [
    {
      label: 'Booking ID',
      render: (booking) => (
        <span className="font-semibold text-slate-800">
          #{booking.id}
        </span>
      ),
    },
    {
      label: 'Guest',
      render: (booking) => (
        <>
          <div className="text-sm font-semibold text-slate-800">
            {booking.user?.fullName}
          </div>
          <div className="text-xs text-slate-500 truncate max-w-[120px] sm:max-w-none">
            {booking.user?.email}
          </div>
        </>
      ),
    },
    {
      label: 'Room',
      render: (booking) => (
        <>
          <div className="text-sm font-semibold text-slate-800">
            {booking.room?.roomNumber}
          </div>
          <div className="text-sm text-slate-500">
            {booking.room?.roomType?.name}
          </div>
        </>
      ),
    },
    {
      label: 'Dates',
      render: (booking) => (
        <>
          <div className="text-sm text-slate-700">
            {new Date(booking.checkInDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-slate-500">
            to {new Date(booking.checkOutDate).toLocaleDateString()}
          </div>
        </>
      ),
    },
    {
      label: 'Total',
      render: (booking) => (
        <span className="font-semibold text-slate-900">
          ${booking.totalPrice}
        </span>
      ),
    },
    {
      label: 'Status',
      render: (booking) => getStatusBadge(booking.status),
    },
    {
      label: 'Actions',
      render: (booking) => (
        <div className="flex items-center">
          {getActionButtons(booking)}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={tableHeaderStyle}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
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
  );
}

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      status: PropTypes.string.isRequired,
      checkInDate: PropTypes.string.isRequired,
      checkOutDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      user: PropTypes.shape({
        fullName: PropTypes.string,
        email: PropTypes.string,
      }),
      room: PropTypes.shape({
        roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        roomType: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
  getStatusBadge: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};