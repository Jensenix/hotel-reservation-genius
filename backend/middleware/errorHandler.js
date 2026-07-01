/**
 * @module errorHandler
 * Global Express error-handling middleware.
 *
 * Responsibilities:
 * - Catch errors forwarded through next(error)
 * - Handle common Sequelize database errors
 * - Handle custom operational errors with statusCode
 * - Return a consistent frontend-friendly error response
 *
 * Register this middleware last in app.js:
 *
 * app.use(errorHandler);
 */

import { sendError } from '#utils/responseHandler.js';

/**
 * Global error-handling middleware.
 *
 * Handles:
 * - SequelizeValidationError
 * - SequelizeUniqueConstraintError
 * - SequelizeForeignKeyConstraintError
 * - Custom errors with statusCode
 * - Unexpected errors as 500 Internal Server Error
 *
 * @param {Error} err Error object
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 *
 * @returns {import('express').Response}
 */
const errorHandler = (err, req, res, _next) => {
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
