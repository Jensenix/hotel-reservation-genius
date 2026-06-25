/**
 * Calculates the total room price based on stay duration.
 */
export const calculateRoomTotal = (checkInDate, checkOutDate, roomBasePrice) => {
  if (!checkInDate || !checkOutDate || !roomBasePrice) return 0;
  
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  
  return nights > 0 ? nights * roomBasePrice : 0;
};

/**
 * Calculates the total cost of selected extra services.
 */
export const calculateExtraServicesTotal = (selectedServices, availableServices) => {
  if (!selectedServices || !availableServices?.length) return 0;

  return Object.entries(selectedServices).reduce((total, [id, qty]) => {
    const service = availableServices.find((s) => s.id === parseInt(id, 10));
    return total + (service ? service.price * qty : 0);
  }, 0);
};