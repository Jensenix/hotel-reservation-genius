const { User, Booking, Review } = require('../models');
const pagination = require('../utils/pagination');

class UserController {
  /**
   * Creates a new user.
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body with user details.
   * @param {string} req.body.fullName - Full name of the user.
   * @param {string} req.body.email - Email address of the user.
   * @param {string} req.body.password - Password for the user.
   * @param {string} [req.body.phoneNumber] - Phone number of the user.
   * @param {string} [req.body.role] - User role, defaults to 'guest'.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the newly created user data.
   */
  async createUser(req, res) {
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

  /**
   * Retrieves all users with optional pagination, role filtering, and searching.
   * @param {Object} req - The Express request object.
   * @param {Object} req.query - The query parameters.
   * @param {number} [req.query.page] - The page number for pagination.
   * @param {number} [req.query.limit] - The number of users per page.
   * @param {string} [req.query.role] - The role to filter by.
   * @param {string} [req.query.search] - Search term matching email or full name.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the paginated list of users.
   */
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit, role, search } = req.query;

      const where = {};

      if (role) {
        where.role = role;
      }

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
        pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit)
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

  /**
   * Retrieves a specific user by their ID, including their bookings and reviews.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response containing the user details.
   */
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

  /**
   * Updates a user's details.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the user.
   * @param {Object} req.body - The user data to update.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response with the updated user details.
   */
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

  /**
   * Deletes a user by their ID.
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The route parameters.
   * @param {string|number} req.params.id - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Promise<Object>} JSON response confirming the deletion.
   */
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