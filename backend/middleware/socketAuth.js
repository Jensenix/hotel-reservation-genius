/**
 * @module socketAuth
 * Socket.IO authentication middleware.
 *
 * Validates JWT tokens during the Socket.IO handshake — the equivalent of
 * the existing HTTP auth middleware but for WebSocket connections. Runs once
 * per connection attempt, before any events are processed.
 *
 * Architecture note:
 * The existing middleware/auth.js cannot intercept Socket.IO handshakes
 * because those arrive as HTTP upgrade requests before Express middleware
 * runs. This module fills that gap using Socket.IO's own middleware API.
 *
 * Client usage:
 *   const socket = io(SERVER_URL, { auth: { token: '<jwt>' } });
 *
 * On success: decoded payload is available as socket.data.user throughout
 *             the socket's lifetime.
 * On failure: the connection is rejected before it is established.
 */

import jwt from 'jsonwebtoken';

/**
 * Socket.IO middleware that authenticates the handshake JWT.
 *
 * Reads the token from socket.handshake.auth.token, verifies it against
 * JWT_SECRET, and attaches the decoded user payload to socket.data.user.
 *
 * Error codes passed to the client via next(err):
 *   AUTH_REQUIRED — no token present in handshake
 *   AUTH_INVALID  — token is malformed, expired, or signed with wrong secret
 *
 * @param {import('socket.io').Socket} socket
 * @param {(err?: Error) => void} next
 */
const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    const err = new Error('Authentication token required');
    err.code = 'AUTH_REQUIRED';
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Attach the full decoded payload so downstream handlers can access
     * userId (decoded.id) and role (decoded.role) without re-verifying.
     */
    socket.data.user = decoded;
    next();
  } catch {
    const err = new Error('Invalid or expired authentication token');
    err.code = 'AUTH_INVALID';
    next(err);
  }
};

export default socketAuth;