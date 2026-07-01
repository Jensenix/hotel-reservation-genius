/**
 * Calculates the total price for a room based on the stay duration and base price.
 * @param {Date} checkInDate
 * @param {Date} checkOutDate
 * @param {number} roomBasePrice
 * @returns {number}
 */
export const calculateRoomTotal = (
  checkInDate,
  checkOutDate,
  roomBasePrice,
) => {
  if (!checkInDate || !checkOutDate || !roomBasePrice) return 0;

  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
  );

  return nights > 0 ? nights * Number(roomBasePrice) : 0;
};

/**
 * Calculates the total cost of selected extra services.
 * @param {Object} selectedServices
 * @param {Array} availableServices
 * @returns {number}
 */
export const calculateExtraServicesTotal = (
  selectedServices,
  availableServices,
) => {
  if (!selectedServices || !availableServices?.length) return 0;

  return Object.entries(selectedServices).reduce((total, [id, qty]) => {
    const service = availableServices.find((s) => String(s.id) === String(id));

    return total + (service ? Number(service.price) * qty : 0);
  }, 0);
};
