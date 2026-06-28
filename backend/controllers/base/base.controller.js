/**
 * @file controllers/base/base.controller.js
 * @description Abstract base that every concrete controller extends.
 *
 * What it provides:
 *   1. asyncHandler – wraps a route callback so try/catch boilerplate
 *      disappears from every controller method. Errors are forwarded to
 *      Express's global error middleware via next(error).
 *   2. Response helpers (sendSuccess, sendCreated, sendPaginated) –
 *      thin aliases of responseHandler so subclasses never need to
 *      import that module directly.
 *
 * Usage in a subclass:
 *
 *   class UserController extends BaseController {
 *     getAll = this.asyncHandler(async (req, res) => {
 *       const data = await userService.getAll(req.query);
 *       this.sendPaginated(res, 'Users retrieved', data.rows, data.pagination);
 *     });
 *   }
 */

import {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendError,
} from '#utils/responseHandler.js';

class BaseController {
  /**
   * Wraps an async Express route handler.
   * Any thrown error (service errors, DB errors, unexpected throws) is
   * caught here and forwarded to the global error handler middleware,
   * so controllers stay free of try/catch blocks.
   *
   * @param {Function} fn - async (req, res, next) => void
   * @returns {Function} Express middleware
   */
  asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // Hands off to middleware/errorHandler.js
    }
  };

  // ── Response helpers ────────────────────────────────────────────────
  // Assigned as instance fields so subclass methods can call `this.sendX`
  // without an extra import.

  /** @see responseHandler.sendSuccess */
  sendSuccess = sendSuccess;

  /** @see responseHandler.sendCreated */
  sendCreated = sendCreated;

  /** @see responseHandler.sendPaginated */
  sendPaginated = sendPaginated;

  /** @see responseHandler.sendError  (rarely needed directly) */
  sendError = sendError;
}

export default BaseController;