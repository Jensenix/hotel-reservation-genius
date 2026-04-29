const { User, Booking, Review } = require('../models');
const pagination = require('../utils/pagination');
const { Op } = require('sequelize');

class UserService {
  /**
   * Creates a new user.
   * @param {Object} data - User data.
   * @returns {Promise<Object>} Created user.
   */
  async createUser({ fullName, email, password, phoneNumber, role }) {
    if (!fullName || !email || !password) {
      const err = new Error('fullName, email, and password are required'); err.statusCode = 400; throw err;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error('Email already exists'); err.statusCode = 400; throw err;
    }

    return User.create({ fullName, email, password, phoneNumber, role: role || 'guest' });
  }

  /**
   * Retrieves all users with pagination.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Paginated users.
   */
  async getAllUsers({ page = 1, limit, role, search }) {
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { offset, limit: parsedLimit } = pagination.getPagination(page, limit);
    const { count, rows } = await User.findAndCountAll({
      where, offset, limit: parsedLimit, order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    return { rows, pagination: pagination.getPagingData({ count, rows }, parseInt(page), parsedLimit) };
  }

  /**
   * Retrieves a specific user by ID.
   * @param {string|number} id - User ID.
   * @returns {Promise<Object>} User data.
   */
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Booking, as: 'bookings', include: ['room'] }, { model: Review, as: 'reviews' }]
    });

    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404; throw err;
    }
    return user;
  }

  /**
   * Updates an existing user.
   * @param {string|number} id - User ID.
   * @param {Object} data - Update data.
   * @returns {Promise<Object>} Updated user.
   */
  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404; throw err;
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        const err = new Error('Email already exists'); err.statusCode = 400; throw err;
      }
    }

    return user.update(data);
  }

  /**
   * Deletes a user.
   * @param {string|number} id - User ID.
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404; throw err;
    }
    await user.destroy();
  }
}

module.exports = new UserService();