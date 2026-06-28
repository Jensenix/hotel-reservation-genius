/**
 * Standardized JSON response sender.
 * Guarantees the frontend receives a consistent object shape.
 */
export const sendResponse = (res, statusCode, message, data = null, pagination = null) => {
  const response = { 
    success: statusCode >= 200 && statusCode < 300 
  };
  
  if (message) response.message = message;
  if (data !== null) response.data = data;
  if (pagination !== null) response.pagination = pagination;

  return res.status(statusCode).json(response);
};