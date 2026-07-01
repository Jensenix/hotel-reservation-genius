import Card from '@/components/ui/Card';
import PropTypes from 'prop-types';

/**
 * Sidebar component that provides a real-time summary of the user's booking details and pricing.
 * It updates dynamically as the user fills out the booking form and selects extra services.
 *
 * @param {Object} props
 * @param {Object} props.state - The entire state object from the booking process.
 * @param {Object} props.state.bookingData
 * @param {string|number} props.state.totalPrice
 * @param {string|number} props.state.extraServicesTotal
 * @param {string|number} props.state.grandTotal
 * @param {Object<string, number>} props.state.selectedExtraServices
 * @param {Array<Object>} props.state.extraServices
 * @returns {JSX.Element}
 */
export default function BookingSummarySidebar({ state }) {
  const {
    room,
    bookingData,
    totalPrice,
    extraServicesTotal,
    grandTotal,
    selectedExtraServices,
    extraServices,
  } = state;

  return (
    <Card className="sticky top-24 md:top-32 shadow-xl border-slate-200">
      <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

      <div className="space-y-4">
        <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {room?.name?.charAt(0) || 'R'}
          </span>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">{room?.name}</h4>
          <p className="text-sm text-gray-600">{room?.description}</p>
        </div>

        {bookingData.checkInDate && bookingData.checkOutDate && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">
                {new Date(bookingData.checkInDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">
                {new Date(bookingData.checkOutDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium">{bookingData.guestCount}</span>
            </div>
          </div>
        )}

        {grandTotal > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Room Price</span>
              <span className="font-semibold text-gray-900">${totalPrice}</span>
            </div>

            {Object.entries(selectedExtraServices).some(
              ([_, qty]) => qty > 0,
            ) && (
              <div className="border-t pt-3 space-y-2">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Extra Services
                </div>
                {Object.entries(selectedExtraServices).map(
                  ([serviceId, quantity]) => {
                    if (quantity > 0) {
                      const service = extraServices.find(
                        (s) => String(s.id) === String(serviceId),
                      );
                      if (service) {
                        return (
                          <div
                            key={serviceId}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-600">
                              {service.serviceName} × {quantity}
                            </span>
                            <span className="text-gray-900">
                              ${Number(service.price) * quantity}
                            </span>
                          </div>
                        );
                      }
                    }
                    return null;
                  },
                )}
                <div className="flex justify-between items-center pt-2 border-t border-dashed">
                  <span className="text-sm font-medium text-gray-700">
                    Services Total
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${extraServicesTotal}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-900">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">
                ${grandTotal}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

BookingSummarySidebar.propTypes = {
  state: PropTypes.shape({
    room: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
    bookingData: PropTypes.shape({
      checkInDate: PropTypes.string,
      checkOutDate: PropTypes.string,
      guestCount: PropTypes.number,
    }).isRequired,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    extraServicesTotal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    grandTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    selectedExtraServices: PropTypes.objectOf(PropTypes.number).isRequired,
    extraServices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        serviceName: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ).isRequired,
  }).isRequired,
};
