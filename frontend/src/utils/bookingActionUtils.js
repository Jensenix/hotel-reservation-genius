/**
 * Single source of truth for the booking self-check-in / self-check-out
 * date-window business rules. Used by BookingCard, BookingSidebar,
 * useMyBookings, and useBookingDetail so all of them agree on what's
 * allowed and show the exact same message when something is blocked.
 *
 * Note: these are UI-layer convenience checks. The real enforcement lives
 * server-side in selfCheckIn / selfCheckOut (booking.service.js on the
 * backend) -- these utils exist purely so the frontend can give the user
 * an immediate, consistent answer without round-tripping to the API.
 */

export const CHECKIN_TOO_EARLY_MESSAGE =
  'You can only check in on or after your scheduled check-in date.';

export const CHECKOUT_TOO_EARLY_MESSAGE =
  'You need to wait until your checkout date, or please ask the admin to assist you with an early checkout.';

export const CHECKOUT_TOO_LATE_MESSAGE =
  'Your checkout date has passed. Please contact the admin to assist you with the checkout process.';

/**
 * Strips the time component so comparisons are day-based, not
 * millisecond-based (e.g. "is it today or later" shouldn't depend on
 * what hour it currently is).
 */
const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const getToday = () => normalizeDate(new Date());

/**
 * One-sided check used to enable/disable the Check In button.
 * No upper bound -- a guest can check in any day on or after checkInDate.
 */
export const isCheckInAllowed = (booking) => {
  if (!booking?.checkInDate) return false;
  return getToday() >= normalizeDate(booking.checkInDate);
};

/**
 * One-sided check used to enable/disable the Check Out button in card/
 * sidebar views. Intentionally does NOT block late checkout on its own --
 * that's enforced by getCheckOutBlockedReason below, right before the API
 * call, so the user gets a clear explanation rather than a button that's
 * just silently disabled.
 */
export const isCheckOutAllowed = (booking) => {
  if (!booking?.checkOutDate) return false;
  return getToday() >= normalizeDate(booking.checkOutDate);
};

/**
 * Two-sided enforcement, meant to run immediately before calling the
 * self-check-out API. Returns a user-facing message if checkout should be
 * blocked, or null if it's allowed to proceed (today === checkOutDate).
 */
export const getCheckOutBlockedReason = (booking) => {
  if (!booking?.checkOutDate) {
    return 'This booking is missing a checkout date.';
  }

  const today = getToday();
  const checkOutDate = normalizeDate(booking.checkOutDate);

  if (today < checkOutDate) return CHECKOUT_TOO_EARLY_MESSAGE;
  if (checkOutDate < today) return CHECKOUT_TOO_LATE_MESSAGE;
  return null;
};