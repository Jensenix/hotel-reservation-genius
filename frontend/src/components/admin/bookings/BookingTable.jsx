import Button from '@/components/ui/Button';

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
        <div className="text-sm text-slate-500">
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
      <div onClick={(e) => e.stopPropagation()}>
        {getActionButtons(booking)}
      </div>
    ),
  },
];

export default function BookingTable({
  bookings,
  getStatusBadge,
  onViewDetails,
  onAction,
}) {
  const getActionButtons = (booking) => {
    const buttons = [];

    if (booking.status === 'pending') {
      buttons.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => onAction(booking, 'confirm')}
          className="mr-2"
        >
          Confirm
        </Button>,
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          onClick={() => onAction(booking, 'cancel')}
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
          onClick={() => onAction(booking, 'check-in')}
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
          onClick={() => onAction(booking, 'check-out')}
        >
          Check Out
        </Button>
      );
    }

    return buttons;
  };

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