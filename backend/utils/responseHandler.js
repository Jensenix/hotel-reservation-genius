/**
 * @file utils/responseHandler.js
 * @description Centralizes all API response formatting so every endpoint
 * returns a consistent shape that the frontend already expects.
 *
 * Existing frontend shape (preserved exactly):
 *   Success:    { success: true,  message, data }
 *   Paginated:  { success: true,  message, data, pagination }
 *   Created:    { success: true,  message, data }   (HTTP 201)
 *   Deleted:    { success: true,  message }          (no data key)
 *   Error:      { success: false, message }
 */

/**
 * Generic success response.
 * Omits the `data` key entirely when no data is provided (e.g. DELETE).
 *
 * @param {import('express').Response} res
 * @param {string}  message
 * @param {*}       [data]       - Payload; omitted when undefined.
 * @param {number}  [statusCode=200]
 */
export const sendSuccess = (res, message, data, statusCode = 200) => {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * 201 Created response – thin wrapper around sendSuccess.
 *
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*}      data
 */
export const sendCreated = (res, message, data) =>
  sendSuccess(res, message, data, 201);

/**
 * Paginated list response.
 * Keeps `data` (rows) and `pagination` as siblings so the frontend
 * can destructure them from the top-level response object.
 *
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array}  rows        - The page of records.
 * @param {Object} pagination  - { page, limit, total, totalPages }
 */
export const sendPaginated = (res, message, rows, pagination) =>
  res.status(200).json({ success: true, message, data: rows, pagination });

/**
 * Error response.
 * Controllers no longer call this directly; they forward to next(error)
 * and the global errorHandler middleware calls this. It is exported so
 * the middleware can import it too.
 *
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 */
export const sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });