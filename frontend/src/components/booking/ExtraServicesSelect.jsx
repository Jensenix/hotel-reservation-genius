import React, { useState, useEffect, useRef } from 'react';

export default function ExtraServicesSelect({ extraServices, selectedExtraServices, setSelectedExtraServices }) {
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
    <div className="relative extra-services-dropdown" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between bg-white hover:bg-gray-50"
      >
        <span className="text-gray-900">
          {selectedCount > 0 ? `${selectedCount} services selected` : 'Select extra services...'}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {extraServices.map((service) => {
            const quantity = selectedExtraServices[service.id] || 0;
            return (
              <div key={service.id} className="p-3 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium text-sm text-gray-900">{service.serviceName}</div>
                  <div className="text-xs text-gray-500">${service.price}/unit</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button type="button" onClick={() => handleExtraServiceChange(service.id, Math.max(0, quantity - 1))} disabled={quantity <= 0} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded">-</button>
                  <div className="w-8 text-center font-semibold text-sm">{quantity}</div>
                  <button type="button" onClick={() => handleExtraServiceChange(service.id, quantity + 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded">+</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}