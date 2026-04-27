const { User } = require('../models');

class AuthController {
  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Manual validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password (assuming password is stored as plain text for now)
      // In production, you should hash passwords with bcrypt
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Return user data without password
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

  // Register user
  async register(req, res) {
    try {
      const { fullName, email, password, phoneNumber, role } = req.body;

      // Manual validation
      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'fullName, email, and password are required'
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        fullName,
        email,
        password, // In production, hash this password
        phoneNumber,
        role: role || 'guest' // Default to 'guest' if not provided
      });

      // Return user data without password
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
