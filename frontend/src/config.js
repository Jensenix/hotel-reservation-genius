import HomeWallpaper from '@/assets/HomeWallpaper.webp';
import HotelLogo from '@/assets/gsh_logo.png';

/**
 * Centralized image asset references used across the frontend.
 */
export const ImageAssets = {
  HomeWallpaper,
  HotelLogo,
};

/**
 * Maximum number of nights a guest can stay in one booking.
 */
export const MaxStayDays = 14;

/**
 * Backend base URL.
 *
 * Use VITE_BASE_URL in .env when deploying to a hosted backend.
 */
export const BaseUrl =
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

/**
 * Backend API base URL.
 */
export const ApiUrl =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const DEBUG = import.meta.env.VITE_DEBUG_MODE === 'true';

/**
 * Debug-only logger.
 *
 * Logs are only printed when VITE_DEBUG_MODE=true.
 */
export const logger = {
  log: (...args) => {
    if (DEBUG) console.log(...args);
  },

  warn: (...args) => {
    if (DEBUG) console.warn(...args);
  },

  error: (...args) => {
    if (DEBUG) console.error(...args);
  },
};

/**
 * WebSocket reconnect retry delays in milliseconds.
 */
export const SocketRetryDelays = [1000, 2000, 5000, 10000];

/**
 * Register form field configuration.
 *
 * Used to render the register form dynamically.
 */
export const RegisterFields = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter your phone number',
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Create a password (min. 6 characters)',
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
  },
];