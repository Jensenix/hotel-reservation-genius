import PropTypes from 'prop-types';

/**
 * Component for selecting a payment method during the booking process.
 *
 * @param {Object} props
 * @param {Array<Object>} props.paymentMethods - List of available payment methods fetched from API.
 * @param {Object} props.bookingData - Current booking state containing paymentMethodId.
 * @param {Function} props.setBookingData - State setter to update the selected payment method.
 * @returns {JSX.Element}
 */
export default function PaymentSelection({
  paymentMethods,
  bookingData,
  setBookingData,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Payment Method
      </h2>

      {paymentMethods.length === 0 ? (
        <div className="p-4 bg-gray-50 text-gray-500 rounded-lg animate-pulse text-sm sm:text-base">
          Loading payment methods...
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {paymentMethods.map((method) => {
            const isSelected =
              bookingData.paymentMethodId === method.id.toString();

            return (
              <label
                key={method.id}
                className={`flex items-start sm:items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethodId"
                  value={method.id}
                  checked={isSelected}
                  onChange={handleInputChange}
                  className="mt-1 sm:mt-0 mr-3 sm:mr-4 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {method.methodName}
                  </div>
                  {method.accountNumber && (
                    <div className="text-xs sm:text-sm text-gray-500 break-all sm:break-normal">
                      {method.accountNumber}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

PaymentSelection.propTypes = {
  paymentMethods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      methodName: PropTypes.string.isRequired,
      accountNumber: PropTypes.string,
    }),
  ).isRequired,
  bookingData: PropTypes.shape({
    paymentMethodId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setBookingData: PropTypes.func.isRequired,
};
