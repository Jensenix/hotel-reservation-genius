/**
 * Component for selecting a payment method during the booking process (Step 2).
 * * @param {Object} props
 * @param {Array} props.paymentMethods - List of available payment methods fetched from API.
 * @param {Object} props.bookingData - Current booking state containing paymentMethodId.
 * @param {Function} props.setBookingData - State setter to update the selected method.
 */
export default function PaymentSelection({ paymentMethods, bookingData, setBookingData }) {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Payment Method
      </h2>

      {paymentMethods.length === 0 ? (
        <div className="p-4 bg-gray-50 text-gray-500 rounded-lg animate-pulse">
          Loading payment methods...
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const isSelected = bookingData.paymentMethodId === method.id.toString();
            
            return (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
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
                  className="mr-4 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {method.methodName}
                  </div>
                  {method.accountNumber && (
                    <div className="text-sm text-gray-500">
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