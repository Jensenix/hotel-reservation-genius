import { apiClient } from '@/services/apiClient';

/**
 * Payment configurations and methods (e.g., Credit Card, PayPal).
 */
export const paymentMethodAPI = {
  getAll: () => apiClient.get('/payment-methods'),
  getById: (id) => apiClient.get(`/payment-methods/${id}`),
  create: (data) => apiClient.post('/payment-methods', data),
  update: (id, data) => apiClient.put(`/payment-methods/${id}`, data),
  delete: (id) => apiClient.delete(`/payment-methods/${id}`),
};

/**
 * Transaction processing endpoints.
 */
export const paymentAPI = {
  getAll: () => apiClient.get('/payments'),
  getById: (id) => apiClient.get(`/payments/${id}`),
  create: (data) => apiClient.post('/payments', data),
  update: (id, data) => apiClient.put(`/payments/${id}`, data),
};

/**
 * Hotel catalog of extra services (e.g., Spa, Airport Transfer) and pricing.
 */
export const extraServiceAPI = {
  getAll: () => apiClient.get('/extra-services'),
  getById: (id) => apiClient.get(`/extra-services/${id}`),
  create: (data) => apiClient.post('/extra-services', data),
  update: (id, data) => apiClient.put(`/extra-services/${id}`, data),
  delete: (id) => apiClient.delete(`/extra-services/${id}`),
};