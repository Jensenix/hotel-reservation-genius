import db from '#models/index.js';
const { User } = db;

class AuthService {
  /**
   * Authenticates a user and retrieves their profile data.
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} The authenticated user's data.
   * @throws {Error} If credentials are missing or invalid.
   */
  async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }

  /**
   * Registers a new user into the system.
   * @param {Object} userData - Data required to create a user.
   * @param {string} userData.fullName - User's full name.
   * @param {string} userData.email - User's email.
   * @param {string} userData.password - User's password.
   * @param {string} [userData.phoneNumber] - User's phone number.
   * @param {string} [userData.role] - User's role.
   * @returns {Promise<Object>} The newly registered user's data.
   * @throws {Error} If validation fails or the user already exists.
   */
  async register({ fullName, email, password, phoneNumber, role }) {
    if (!fullName || !email || !password) {
      const error = new Error('fullName, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role: role || 'guest',
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }
}

export default new AuthService();
