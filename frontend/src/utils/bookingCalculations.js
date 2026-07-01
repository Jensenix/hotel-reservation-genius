/**
 * Calculates the number of nights between two dates.
 * @param {Date} checkInDate
 * @param {Date} checkOutDate
 * @returns {number}
 */
export const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
  );
  return nights > 0 ? nights : 0;
};

/**
 * Calculates the total price for a booking, including room price and extra services.
 * @param {Date} checkInDate
 * @param {Date} checkOutDate
 * @param {number} basePrice
 * @returns {number}
 */
export const calculateRoomPrice = (checkInDate, checkOutDate, basePrice) => {
  return calculateNights(checkInDate, checkOutDate) * (basePrice || 0);
};

/**
 * Calculates the total price for extra services selected for a booking.
 * @param {Object} selectedServices
 * @param {Array} availableServices
 * @returns {number}
 */
export const calculateExtraServicesTotal = (
  selectedServices,
  availableServices,
) => {
  let total = 0;
  Object.entries(selectedServices).forEach(([serviceId, quantity]) => {
    if (quantity > 0) {
      const service = availableServices.find(
        (s) => s.id === parseInt(serviceId, 10),
      );
      if (service) {
        total += service.price * quantity;
      }
    }
  });
  return total;
};
