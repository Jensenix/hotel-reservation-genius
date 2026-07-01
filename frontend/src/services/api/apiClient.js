import axios from 'axios';
import { ApiUrl } from '@/config';
import { logger } from '@/config';

/**
 * Axios instance for making API requests to the backend.
 * Automatically includes the Authorization header if a user is logged in.
 */
export const apiClient = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const token = user.token || user.data?.token;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        logger.error('Failed to parse user from local storage', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
