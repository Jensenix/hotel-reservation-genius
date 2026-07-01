/**
 * @module responseHandler
 * Centralized API response formatting helpers.
 *
 * Responsibilities:
 * - Keep API response shapes consistent across controllers
 * - Preserve frontend-compatible response structures
 * - Avoid repeated res.status(...).json(...) code in controllers
 *
 * Preserved response shapes:
 * Success:
 * {
 *   success: true,
 *   message,
 *   data
 * }
 *
 * Paginated:
 * {
 *   success: true,
 *   message,
 *   data,
 *   pagination
 * }
 *
 * Deleted / no data:
 * {
 *   success: true,
 *   message
 * }
 *
 * Error:
 * {
 *   success: false,
 *   message
 * }
 */

/**
 * Sends a generic success response.
 *
 * The data key is only included when data is not undefined.
 * This is useful for DELETE responses where the frontend expects no data key.
 *
 * @param {import('express').Response} res Express response object
 * @param {string} message Success message
 * @param {*} [data] Optional response payload
 * @param {number} [statusCode=200] HTTP status code
 *
 * @returns {import('express').Response}
 */
export const sendSuccess = (res, message, data, statusCode = 200) => {
  const body = { success: true, message };

  if (data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
};

/**
 * Sends a 201 Created response.
 *
 * Thin wrapper around sendSuccess() for create endpoints.
 *
 * @param {import('express').Response} res Express response object
 * @param {string} message Success message
 * @param {*} data Created resource payload
 *
 * @returns {import('express').Response}
 */
export const sendCreated = (res, message, data) =>
  sendSuccess(res, message, data, 201);

/**
 * Sends a paginated success response.
 *
 * Keeps data and pagination as top-level sibling keys so existing frontend
 * hooks can safely destructure them from response.data.
 *
 * @param {import('express').Response} res Express response object
 * @param {string} message Success message
 * @param {Array} rows Current page records
 * @param {object} pagination Pagination metadata
 *
 * @returns {import('express').Response}
 */
export const sendPaginated = (res, message, rows, pagination) =>
  res.status(200).json({
    success: true,
    message,
    data: rows,
    pagination,
  });

/**
 * Sends a standardized error response.
 *
 * Usually called by the global errorHandler middleware instead of directly
 * inside controllers.
 *
 * @param {import('express').Response} res Express response object
 * @param {string} message Error message
 * @param {number} [statusCode=500] HTTP status code
 *
 * @returns {import('express').Response}
 */
export const sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({
    success: false,
    message,
  });