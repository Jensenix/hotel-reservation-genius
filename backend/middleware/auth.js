/**
 * @module authMiddleware
 * Express authentication and authorization middleware.
 *
 * Responsibilities:
 * - Validate JWT Bearer tokens
 * - Attach decoded user data to req.user
 * - Protect routes that require login
 * - Restrict admin-only routes
 */

import jwt from 'jsonwebtoken';
import { jwtSecret } from '#config/config.js';

/**
 * Authenticates a request using a JWT Bearer token.
 *
 * Expected header:
 * Authorization: Bearer <token>
 *
 * On success:
 * - Decodes the JWT
 * - Stores decoded data in req.user
 * - Passes control to the next middleware/controller
 *
 * OPTIONS requests are allowed through so CORS preflight requests do not fail.
 *
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 *
 * @returns {void}
 */
export const authenticateToken = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * Restricts access to admin users only.
 *
 * This middleware should run after authenticateToken because it depends on
 * req.user being available.
 *
 * OPTIONS requests are allowed through for CORS preflight handling.
 *
 * @param {import('express').Request} req Express request object
 * @param {import('express').Response} res Express response object
 * @param {import('express').NextFunction} next Express next function
 *
 * @returns {void}
 */
export const requireAdmin = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};