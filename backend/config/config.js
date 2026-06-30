/**
 * @fileoverview Configuration Management Module
 * Loads environment variables and provides centralized configuration for 
 * database connections, authentication, and security middleware.
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Database configurations categorized by environment.
 * @typedef {Object} DBConfig
 * @property {string|undefined} username
 * @property {string|undefined} password
 * @property {string|undefined} database
 * @property {string|undefined} host
 * @property {string|undefined} dialect
 * @property {boolean} logging
 */

/** @type {{ development: DBConfig, test: DBConfig, production: DBConfig }} */
export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
};

/** 
 * JWT secret used for signing authentication tokens.
 * Defaults to 'JWT_SECRET_FAKE_KEY' if not provided in environment.
 * @type {string} 
 */
export const jwtSecret = process.env.JWT_SECRET || 'JWT_SECRET_FAKE_KEY';

/** 
 * CORS configuration options for Express/middleware.
 * @type {Object}
 */
export const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/** @constant {number} Maximum number of allowed stay days */
export const MaxStayDays = 14;

/** @constant {number} Helper constant for time calculations (ms) */
export const OneDayInMs = 1000 * 60 * 60 * 24;