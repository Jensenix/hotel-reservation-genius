/**
 * @file middleware/errorHandler.js
 * @description Global error-handling middleware registered last in app.js.
 *
 * Handles:
 *   1. Sequelize-specific errors (validation, unique constraint, FK violation)
 *   2. Custom operational errors thrown by services with a `statusCode` field
 *      e.g.  throw Object.assign(new Error('Not found'), { statusCode: 404 })
 *   3. Any unexpected/unhandled errors → 500 Internal Server Error
 *
 * All responses use { success, message } so the frontend can check
 * `response.data.success === false` uniformly across all error types.
 *
 * NOTE: The previous Sequelize error blocks used an `error` key instead of
 * `success: false`. This update adds `success: false` for consistency.
 * Sequelize errors are DB-layer errors that the frontend shows as generic
 * failures, so this change does not affect the established API contract.
 */

import { sendError } from '#utils/responseHandler.js';

/**
 * Global error-handling middleware for Express.
 *
 * @middleware
 * @param {Object} err - The error object thrown in the application.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 *
 * @returns {void}
 *  
 * @example
 * // In app.js, register this middleware last:
 * app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ErrorHandler] ${req.method} ${req.originalUrl}`, err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate Entry',
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Foreign Key Constraint Error',
      details: err.message,
    });
  }

  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, 'Internal Server Error', 500);
};

export default errorHandler;