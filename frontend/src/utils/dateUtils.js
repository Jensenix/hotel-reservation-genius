export const formatLongDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateIndonesian = (date) => {
  if (!date) return '';
  
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    return ''; 
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: typeof date === 'string' && !date.includes('T') ? 'UTC' : undefined
  }).format(parsedDate);
};
