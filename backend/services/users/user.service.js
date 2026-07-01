import db from '#models/index.js';
const { User, Booking, Review } = db;

import { Op } from 'sequelize';
import pagination from '#utils/pagination.js';
import UserEvents from '#utils/events/userEvents.js';

class UserService {
  /**
   * Creates a new user.
   *
   * Also publishes user:created to the admin dashboard so other admin pages
   * can update in real time.
   *
   * @param {Object} data User data
   * @param {string} data.fullName Full name
   * @param {string} data.email Email address
   * @param {string} data.password Password
   * @param {string} [data.phoneNumber] Phone number
   * @param {string} [data.role] User role
   * @param {Object|null} [actor=null] Admin/staff user who performed the action
   *
   * @returns {Promise<Object>} Created user without password
   */
  async createUser(
    { fullName, email, password, phoneNumber, role },
    actor = null,
  ) {
    if (!fullName || !email || !password) {
      const err = new Error('fullName, email, and password are required');
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const err = new Error('Email already exists');
      err.statusCode = 400;
      throw err;
    }

    const createdUser = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role: role || 'guest',
    });

    const safeUser = await User.findByPk(createdUser.id, {
      attributes: { exclude: ['password'] },
    });

    await UserEvents.userCreated(safeUser, actor);

    return safeUser;
  }

  /**
   * Retrieves all users with pagination.
   *
   * @param {Object} query Query parameters
   * @param {number|string} [query.page=1] Current page
   * @param {number|string} [query.limit] Records per page
   * @param {string} [query.role] Optional role filter
   * @param {string} [query.search] Optional name/email search term
   *
   * @returns {Promise<Object>} Paginated users
   */
  async getAllUsers({ page = 1, limit, role, search }) {
    const where = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { offset, limit: parsedLimit } = pagination.getPagination(
      page,
      limit,
    );

    const { count, rows } = await User.findAndCountAll({
      where,
      offset,
      limit: parsedLimit,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return {
      rows,
      pagination: pagination.getPagingData(
        { count, rows },
        parseInt(page),
        parsedLimit,
      ),
    };
  }

  /**
   * Retrieves a specific user by ID.
   *
   * @param {string|number} id User ID
   *
   * @returns {Promise<Object>} User data
   */
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Booking, as: 'bookings', include: ['room'] },
        { model: Review, as: 'reviews' },
      ],
    });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return user;
  }

  /**
   * Updates an existing user.
   *
   * Supports optimistic conflict protection through expectedUpdatedAt.
   *
   * Flow:
   * - Frontend opens edit modal with the user's current updatedAt value.
   * - Frontend sends expectedUpdatedAt when submitting.
   * - Backend compares expectedUpdatedAt with the latest database updatedAt.
   * - If they differ, another admin already saved newer data.
   * - Backend rejects with 409 Conflict instead of overwriting newer data.
   *
   * Also publishes user:updated after a successful update so other admin pages
   * can update in real time.
   *
   * @param {string|number} id User ID
   * @param {Object} data Update data
   * @param {string} [data.expectedUpdatedAt] The updatedAt value from when editing started
   * @param {Object|null} [actor=null] Admin/staff user who performed the action
   *
   * @returns {Promise<Object>} Updated user without password
   */
  async updateUser(id, data, actor = null) {
    const { expectedUpdatedAt, ...updateData } = data;

    const user = await User.findByPk(id);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    if (expectedUpdatedAt) {
      const currentUpdatedAt = new Date(user.updatedAt).getTime();
      const expectedTime = new Date(expectedUpdatedAt).getTime();

      if (currentUpdatedAt !== expectedTime) {
        const err = new Error(
          'This user was updated by another admin. Please refresh before saving.',
        );
        err.statusCode = 409;
        throw err;
      }
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email: updateData.email,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingUser) {
        const err = new Error('Email already exists');
        err.statusCode = 400;
        throw err;
      }
    }

    if (!updateData.password) {
      delete updateData.password;
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    await UserEvents.userUpdated(updatedUser, actor);

    return updatedUser;
  }

  /**
   * Deletes a user.
   *
   * Also publishes user:deleted after successful delete so other admin pages
   * can update in real time.
   *
   * @param {string|number} id User ID
   * @param {Object|null} [actor=null] Admin/staff user who performed the action
   *
   * @returns {Promise<void>}
   */
  async deleteUser(id, actor = null) {
    const user = await User.findByPk(id);

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const deletedUserId = user.id;

    await user.destroy();

    await UserEvents.userDeleted(deletedUserId, actor);
  }
}

export default new UserService();
