import { apiClient } from '@/services/api/apiClient';

/**
 * Frontend API wrapper for admin revenue reporting endpoints.
 */
export const revenueAPI = {
  getStats: (params) => apiClient.get('/revenue/stats', { params }),
  getMonthlyRevenue: (params) => apiClient.get('/revenue/monthly', { params }),
  getRevenueByRoomType: (params) =>
    apiClient.get('/revenue/by-room-type', { params }),
  getRecentTransactions: (params) =>
    apiClient.get('/revenue/recent-transactions', { params }),
};

/**
 * Frontend API wrapper for admin guest management endpoints.
 */
export const guestsAPI = {
  getAll: (params) => apiClient.get('/guests', { params }),
  getById: (id) => apiClient.get(`/guests/${id}`),
  getStats: (params) => apiClient.get('/guests/stats', { params }),
};
