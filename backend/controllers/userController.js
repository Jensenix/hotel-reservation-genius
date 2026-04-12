const { User, Booking, Review } = require('../models');
const pagination = require('../utils/pagination');

class UserController {
  // Create new user
  async createUser(req, res) {
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

      const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        role: role || 'guest'
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  // Get all users with pagination and filtering
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;

      const where = {};

      // Filter by role
      if (role) {
        where.role = role;
      }

      // Search by name or email
      if (search) {
        where[require('sequelize').Op.or] = [
          { fullName: { [require('sequelize').Op.like]: `%${search}%` } },
          { email: { [require('sequelize').Op.like]: `%${search}%` } }
        ];
      }

      const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);

      const { count, rows } = await User.findAndCountAll({
        where,
        offset,
        limit: parsedLimit,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: rows,
        pagination: pagination.getPagingData(count, page, parsedLimit)
      });
    } catch (error) {
      console.error('Error getting users:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting users',
        error: error.message
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Booking,
            as: 'bookings',
            include: ['room']
          },
          {
            model: Review,
            as: 'reviews'
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Error getting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting user',
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { fullName, email, password, phoneNumber, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email already exists (if email is being changed)
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      await user.update({
        fullName: fullName || user.fullName,
        email: email || user.email,
        password: password || user.password,
        phoneNumber: phoneNumber || user.phoneNumber,
        role: role || user.role
      });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await user.destroy();

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
