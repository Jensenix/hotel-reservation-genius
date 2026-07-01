import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {number} props.step
 * @returns {JSX.Element}
 */ 
export default function BookingStepper({ step }) {
  return (
    <div className="mb-8 overflow-hidden">
      <div className="flex items-center justify-center w-full max-w-md mx-auto">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center text-xs sm:text-base ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            1
          </div>
          <span className="ml-2 font-medium text-xs sm:text-base whitespace-nowrap">Booking Details</span>
        </div>
        
        <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-4 shrink-0 transition-colors duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center text-xs sm:text-base ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            2
          </div>
          <span className="ml-2 font-medium text-xs sm:text-base whitespace-nowrap">Payment</span>
        </div>
      </div>
    </div>
  );
}

BookingStepper.propTypes = {
  step: PropTypes.number.isRequired,
};