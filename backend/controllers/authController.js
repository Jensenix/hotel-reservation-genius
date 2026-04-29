const authService = require('../services/authService');

class AuthController {
  /**
   * Handles user authentication requests.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with authentication status and user data.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: userData
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error during login',
        error: error.message
      });
    }
  }

  /**
   * Handles new user registration requests.
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with registration status and user data.
   */
  async register(req, res) {
    try {
      const userData = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: userData
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.statusCode ? error.message : 'Error during registration',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();