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

const errorHandler = (err, req, res, next) => {
  // Always log the full stack server-side for debugging
  console.error(`[ErrorHandler] ${req.method} ${req.originalUrl}`, err.stack);

  // ── Sequelize: model validation failed ─────────────────────────────
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.errors.map((e) => e.message),
    });
  }

  // ── Sequelize: unique constraint violated ───────────────────────────
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate Entry',
      details: err.errors.map((e) => e.message),
    });
  }

  // ── Sequelize: foreign key constraint violated ──────────────────────
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Foreign Key Constraint Error',
      details: err.message,
    });
  }

  // ── Custom operational errors from services ─────────────────────────
  // Services throw:  const err = new Error('Room not found'); err.statusCode = 404;
  // If statusCode is present → it's a known, intentional error → expose message.
  // If statusCode is absent  → it's unexpected → hide internal detail.
  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode);
  }

  // ── Fallback: unexpected server error ───────────────────────────────
  return sendError(res, 'Internal Server Error', 500);
};

export default errorHandler;