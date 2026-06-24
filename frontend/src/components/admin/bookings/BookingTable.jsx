import Button from '@/components/ui/Button';

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
        </Button>,
      );
    } else if (booking.status === 'confirmed') {
      buttons.push(
        <Button
          key="check-in"
          size="sm"
          onClick={() => onAction(booking, 'check-in')}
        >
          Check In
        </Button>,
      );
    } else if (booking.status === 'checked-in') {
      buttons.push(
        <Button
          key="check-out"
          size="sm"
          onClick={() => onAction(booking, 'check-out')}
        >
          Check Out
        </Button>,
      );
    }
    return buttons;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Booking ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-slate-50 cursor-pointer transition-colors duration-150"
              onClick={() => onViewDetails(booking)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                #{booking.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-800">
                  {booking.user?.fullName}
                </div>
                <div className="text-sm text-slate-500">
                  {booking.user?.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-800">
                  {booking.room?.roomNumber}
                </div>
                <div className="text-sm text-slate-500">
                  {booking.room?.roomType?.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-700">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-500">
                  to {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                ${booking.totalPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(booking.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div onClick={(e) => e.stopPropagation()}>
                  {getActionButtons(booking)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
