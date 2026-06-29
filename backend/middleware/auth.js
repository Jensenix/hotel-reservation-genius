/**
 * Authentication Middleware
 *
 * Provides middleware functions for:
 * - Validating JWT access tokens from request headers
 * - Attaching authenticated user information to the request object
 * - Restricting routes based on user roles
 *
 * Uses JWT Bearer token authentication:
 * Authorization: Bearer <token>
 */

import jwt from 'jsonwebtoken';
import { jwtSecret } from '#config/config.js';


/**
 * Verify JWT token and authenticate user.
 *
 * Checks the Authorization header for a valid Bearer token,
 * verifies the token using the configured JWT secret, and stores
 * the decoded user information in req.user.
 *
 * Allows OPTIONS requests to pass through for CORS preflight handling.
 *
 * @middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {void}
 *
 * @example
 * router.get('/profile', authenticateToken, controller.getProfile);
 *
 * // After successful authentication:
 * req.user = {
 *   id: 1,
 *   role: "admin"
 * }
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
 * Restrict route access to admin users only.
 *
 * Requires authenticateToken middleware to run first because
 * it depends on req.user containing decoded JWT information.
 *
 * Allows OPTIONS requests to pass through for CORS preflight handling.
 *
 * @middleware
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 *
 * @returns {void}
 *
 * @example
 * router.post(
 *   '/users',
 *   authenticateToken,
 *   requireAdmin,
 *   controller.createUser
 * );
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