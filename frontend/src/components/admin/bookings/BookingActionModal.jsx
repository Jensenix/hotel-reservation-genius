import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function BookingActionModal({
  isOpen,
  onClose,
  actionType,
  selectedBooking,
  cancelReason,
  setCancelReason,
  executeAction,
}) {
  if (!isOpen) return null;

  const title =
    actionType === 'cancel'
      ? `Cancel Booking #${selectedBooking?.id}`
      : `${actionType.charAt(0).toUpperCase() + actionType.slice(1).replace('-', ' ')} Booking #${selectedBooking?.id}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {actionType === 'cancel' ? (
          <div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for cancelling this booking. This action
              cannot be undone.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancel Reason
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reason for cancellation..."
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-600">
              Are you sure you want to {actionType.replace('-', ' ')} this
              booking?
            </p>
            {selectedBooking && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                <div className="font-medium">
                  Guest: {selectedBooking.user?.fullName}
                </div>
                <div>Room: {selectedBooking.room?.roomNumber}</div>
                <div>
                  Dates:{' '}
                  {new Date(selectedBooking.checkInDate).toLocaleDateString()} -{' '}
                  {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                </div>
                <div>Total: ${selectedBooking.totalPrice}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button
            onClick={executeAction}
            disabled={actionType === 'cancel' && !cancelReason.trim()}
            className={
              actionType === 'cancel'
                ? 'bg-red-600 hover:bg-red-700 text-white border-none'
                : ''
            }
          >
            {actionType === 'cancel'
              ? 'Yes, Cancel Booking'
              : title.split(' Booking')[0]}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

BookingActionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.oneOf(['cancel', 'confirm', 'approve', 'reject']).isRequired,
  selectedBooking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.shape({
      fullName: PropTypes.string,
    }),
    room: PropTypes.shape({
      roomNumber: PropTypes.string,
    }),
    checkInDate: PropTypes.string,
    checkOutDate: PropTypes.string,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  cancelReason: PropTypes.string.isRequired,
  setCancelReason: PropTypes.func.isRequired,
  executeAction: PropTypes.func.isRequired,
};