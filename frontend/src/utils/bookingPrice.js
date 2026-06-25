/**
 * Calculates the total room price based on stay duration.
 */
export const calculateRoomTotal = (checkInDate, checkOutDate, roomBasePrice) => {
  if (!checkInDate || !checkOutDate || !roomBasePrice) return 0;
  
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  
  return nights > 0 ? nights * Number(roomBasePrice) : 0;
};

/**
 * Calculates the total cost of selected extra services.
 */
export const calculateExtraServicesTotal = (selectedServices, availableServices) => {
  if (!selectedServices || !availableServices?.length) return 0;

  return Object.entries(selectedServices).reduce((total, [id, qty]) => {
    // FIX: Convert both IDs to strings so they safely match
    const service = availableServices.find((s) => String(s.id) === String(id));
    
    // FIX: Ensure the price is treated as a Number before multiplying
    return total + (service ? Number(service.price) * qty : 0);
  }, 0);
};