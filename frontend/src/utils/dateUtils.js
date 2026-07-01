/**
 * Formats a date string into a long date format.
 * @param {string} dateString
 * @returns {string}
 */
export const formatLongDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date into Indonesian locale format.
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatDateIndonesian = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('id-ID', {
    timeZone:
      typeof date === 'string' && !date.includes('T') ? 'UTC' : undefined,
  }).format(parsedDate);
};

/**
 * @param {Date|string|number} dateObj
 * @returns {string}
 */
export const getLocalYYYYMMDD = (dateObj) => {
  const d = new Date(dateObj);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};
