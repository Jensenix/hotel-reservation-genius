import authService from '#services/users/auth.service.js';
import { sendResponse } from '#utils/responseHandler.js';

class AuthController {
  /**
   * Handles user authentication requests.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware handler.
   */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      return sendResponse(res, 200, 'Login successful', userData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles new user registration requests.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware handler.
   */
  register = async (req, res, next) => {
    try {
      const userData = await authService.register(req.body);

      return sendResponse(res, 201, 'Registration successful', userData);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();