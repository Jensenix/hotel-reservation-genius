const { User } = require('../models');

class AuthController {
  /**
   * Authenticates a user and returns their data.
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.email - User's email.
   * @param {string} req.body.password - User's password.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with authentication status and user data.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      };

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: userData
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message
      });
    }
  }

  /**
   * Registers a new user.
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.fullName - User's full name.
   * @param {string} req.body.email - User's email.
   * @param {string} req.body.password - User's password.
   * @param {string} [req.body.phoneNumber] - User's phone number.
   * @param {string} [req.body.role] - User's role.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with registration status and user data.
   */
  async register(req, res) {
    try {
      const { fullName, email, password, phoneNumber, role } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'fullName, email, and password are required'
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        role: role || 'guest'
      });

      const userData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      };

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: userData
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({
        success: false,
        message: 'Error during registration',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();