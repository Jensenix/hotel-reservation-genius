import React from 'react';
import Modal from '@/components/ui/Modal';

export default function BookingDetailModal({
  isOpen,
  onClose,
  selectedBooking,
  bookingDetails,
  loadingDetails,
  getStatusBadge,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking Details #${selectedBooking?.id}`}
      size="lg"
    >
      {loadingDetails ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      ) : bookingDetails ? (
        <div className="space-y-3">
          {/* Guest & Room Info - Combined */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Guest Information
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">
                    {bookingDetails.user?.fullName || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm text-gray-700">
                    {bookingDetails.user?.email || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Room Information
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500">Room Number</div>
                  <div className="font-medium text-gray-900">
                    {bookingDetails.room?.roomNumber || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Room Type</div>
                  <div className="text-sm text-gray-700">
                    {bookingDetails.room?.roomType?.name || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Booking Details
            </h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500">Check-in</div>
                <div className="font-medium text-gray-900">
                  {new Date(bookingDetails.checkInDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Check-out</div>
                <div className="font-medium text-gray-900">
                  {new Date(bookingDetails.checkOutDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1">
                  {getStatusBadge(bookingDetails.status)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-bold text-blue-600">
                  ${parseFloat(bookingDetails.totalPrice)}
                </div>
              </div>
            </div>
          </div>

          {/* Extra Services */}
          {bookingDetails.extraServices &&
            bookingDetails.extraServices.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Extra Services
                </h3>
                <div className="space-y-2">
                  {bookingDetails.extraServices.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm"
                    >
                      <span className="font-medium text-gray-900">
                        {item.serviceName} ×{' '}
                        {item.BookingExtraService?.quantity || 1}
                      </span>
                      <span className="font-semibold text-gray-900">
                        $
                        {parseFloat(item.BookingExtraService?.subtotal) ||
                          parseFloat(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Special Requests */}
          {bookingDetails.specialRequests && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Special Requests
              </h3>
              <p className="text-sm text-gray-700">
                {bookingDetails.specialRequests}
              </p>
            </div>
          )}

          {/* Payment Information */}
          {bookingDetails.payment && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Payment Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900">
                    {bookingDetails.payment.paymentMethod?.methodName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">
                    ${parseFloat(bookingDetails.payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  {getStatusBadge(bookingDetails.payment.paymentStatus)}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          No booking details available
        </div>
      )}
    </Modal>
  );
}
