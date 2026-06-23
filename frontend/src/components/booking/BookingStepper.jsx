/**
 * Visual indicator for the user's progress through the booking flow.
 * * @param {Object} props
 * @param {number} props.step - The current active step (1 or 2).
 */
export default function BookingStepper({ step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            1
          </div>
          <span className="ml-2 font-medium">Booking Details</span>
        </div>
        <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>
    </div>
  );
}