import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function ExtraServicesSelect({ 
  extraServices = [], 
  selectedExtraServices = {}, 
  setSelectedExtraServices 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExtraServiceChange = (serviceId, quantity) => {
    setSelectedExtraServices(prev => ({ ...prev, [serviceId]: quantity }));
  };

  const selectedCount = Object.values(selectedExtraServices).filter(qty => qty > 0).length;

  return (
    <div className="relative extra-services-dropdown w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-900 truncate pr-2">
          {selectedCount > 0 ? `${selectedCount} services selected` : 'Select extra services...'}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {extraServices.map((service) => {
            const quantity = selectedExtraServices[service.id] || 0;
            return (
              <div key={service.id} className="p-3 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{service.serviceName}</div>
                  <div className="text-xs text-gray-500">${service.price}/unit</div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-2 self-start sm:self-auto bg-gray-50 sm:bg-transparent p-1 rounded-md">
                  <button 
                    type="button" 
                    onClick={() => handleExtraServiceChange(service.id, Math.max(0, quantity - 1))} 
                    disabled={quantity <= 0} 
                    className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <div className="w-6 text-center font-semibold text-sm">{quantity}</div>
                  <button 
                    type="button" 
                    onClick={() => handleExtraServiceChange(service.id, quantity + 1)} 
                    className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

ExtraServicesSelect.propTypes = {
  extraServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      serviceName: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ),
  selectedExtraServices: PropTypes.objectOf(
    PropTypes.number
  ),
  setSelectedExtraServices: PropTypes.func.isRequired,
};