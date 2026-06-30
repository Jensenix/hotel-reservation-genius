/**
 * Configuration Management Module
 *
 * Loads environment variables from .env file and exports:
 * - Database configurations for development, test, and production environments
 * - JWT secret for authentication token signing
 * - CORS options for cross-origin request handling
 *
 * Environment Variables Required:
 * DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT, JWT_SECRET, CLIENT_URL
 */

import dotenv from 'dotenv';
dotenv.config();

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
    database: process.env.DB_NAME + '_test',
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

export const jwtSecret = process.env.JWT_SECRET || 'JWT_SECRET_FAKE_KEY';

export const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const MaxStayDays = 14;
export const OneDayInMs = 1000 * 60 * 60 * 24;