import db from '#models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '#config/config.js';
const { User } = db;

class AuthService {
  /**
   * Authenticates user and returns user info + JWT.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isHashedPassword =
      user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

    const isMatch = isHashedPassword
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token,
    };
  }
  /**
   * Registers a new user with a hashed password.
   * @param {Object} userData
   * @returns {Promise<Object>} - The created user object
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
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
