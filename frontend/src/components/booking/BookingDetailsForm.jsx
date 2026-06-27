import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import Button from '@/components/ui/Button';
import ExtraServicesSelect from './ExtraServicesSelect';
import PropTypes from 'prop-types';

/**
 * Component for Step 1 of the booking process, where users input their booking details.
 *
 * @param {Object} props
 * @param {Object} props.bookingData - Current booking state containing check-in/out dates, guest count, etc.
 * @param {Function} props.setBookingData - State setter to update booking details.
 * @param {Object} props.room - The room being booked, used for validation and display.
 * @param {Array} props.extraServices - List of available extra services fetched from API.
 * @param {Object} props.selectedExtraServices - Current state of selected extra services and their quantities.
 * @param {Function} props.setSelectedExtraServices - State setter to update selected extra services.
 * @param {string|null} props.bookingId - If a booking is already pending, this will be the booking ID to continue payment.
 * @param {Function} props.onContinue - Function to call when user clicks "Continue to Payment" for an existing booking.
 * @param {boolean} props.isProcessingPayment - Flag to indicate if payment processing is underway, to disable continue button.
 */
export default function BookingDetailsForm({
  bookingData,
  setBookingData,
  room,
  extraServices,
  selectedExtraServices,
  setSelectedExtraServices,
  bookingId,
  onContinue,
  isProcessingPayment,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  // If a booking is already pending, just show the continue prompt
  if (bookingId) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Continue Payment
        </h2>
        <p className="text-gray-600 mb-6">
          You have a pending booking. Click &quot;Continue to Payment&quot; to proceed
          with payment.
        </p>
        <Button onClick={onContinue} disabled={isProcessingPayment}>
          {isProcessingPayment ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <div className="relative w-full">
            <DatePicker
              id="checkInDate"
              selected={bookingData.checkInDate}
              onChange={(date) =>
                setBookingData((prev) => ({ ...prev, checkInDate: date }))
              }
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select check-in date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <div className="relative w-full">
            <DatePicker
              id="checkOutDate"
              selected={bookingData.checkOutDate}
              onChange={(date) =>
                setBookingData((prev) => ({ ...prev, checkOutDate: date }))
              }
              minDate={bookingData.checkInDate || new Date()}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select check-out date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  setBookingData((prev) => ({
                    ...prev,
                    guestCount: Math.max(1, prev.guestCount - 1),
                  }))
                }
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                disabled={bookingData.guestCount <= 1}
              >
                -
              </button>
              <div className="px-6 py-2 min-w-[80px] text-center font-semibold text-lg">
                {bookingData.guestCount}
              </div>
              <button
                type="button"
                onClick={() =>
                  setBookingData((prev) => ({
                    ...prev,
                    guestCount: Math.min(room.maxCapacity, prev.guestCount + 1),
                  }))
                }
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                disabled={bookingData.guestCount >= room.maxCapacity}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Max {room.maxCapacity} guests
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests{' '}
          <span className="text-gray-400 font-normal ml-1">(Optional)</span>
        </label>
        <textarea
          name="specialRequests"
          value={bookingData.specialRequests}
          onChange={handleInputChange}
          rows={4}
          maxLength={500}
          placeholder="Late check-in, early check-out, room preferences..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extra Services{' '}
          <span className="text-gray-400 font-normal ml-1">(Optional)</span>
        </label>
        <ExtraServicesSelect
          extraServices={extraServices}
          selectedExtraServices={selectedExtraServices}
          setSelectedExtraServices={setSelectedExtraServices}
        />
      </div>
    </div>
  );
}

BookingDetailsForm.propTypes = {
  bookingData: PropTypes.object.isRequired,
  setBookingData: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
  extraServices: PropTypes.array.isRequired,
  selectedExtraServices: PropTypes.object.isRequired,
  setSelectedExtraServices: PropTypes.func.isRequired,
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onContinue: PropTypes.func.isRequired,
  isProcessingPayment: PropTypes.bool.isRequired,
};