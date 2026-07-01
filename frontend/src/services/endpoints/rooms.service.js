import { apiClient } from '@/services/api/apiClient';

/**
 * Room API service for frontend interactions with the backend room endpoints.
 */
export const roomAPI = {
  getAll: () => apiClient.get('/rooms'),
  getById: (id) => apiClient.get(`/rooms/${id}`),
  create: (data) => apiClient.post('/rooms', data),
  update: (id, data) => apiClient.put(`/rooms/${id}`, data),
  delete: (id) => apiClient.delete(`/rooms/${id}`),
  updateStatus: (id, status) => apiClient.put(`/rooms/${id}/status`, { status }),
};

/**
 * Room Type API service for frontend interactions with the backend room type endpoints.
 */
export const roomTypeAPI = {
  getAll: () => apiClient.get('/room-types'),
  getById: (id) => apiClient.get(`/room-types/${id}`),
  create: (data) => apiClient.post('/room-types', data),
  update: (id, data) => apiClient.put(`/room-types/${id}`, data),
  delete: (id) => apiClient.delete(`/room-types/${id}`),
};

/**
 * Facility API service for frontend interactions with the backend facility endpoints.
 */
export const facilityAPI = {
  getAll: () => apiClient.get('/facilities'),
  getById: (id) => apiClient.get(`/facilities/${id}`),
  create: (data) => apiClient.post('/facilities', data),
  update: (id, data) => apiClient.put(`/facilities/${id}`, data),
  delete: (id) => apiClient.delete(`/facilities/${id}`),
};

/**
 * Room Availability API service for frontend interactions with the backend room availability endpoints.
 */
export const roomAvailabilityAPI = {
  getAvailability: (params) => apiClient.get('/room-availability', { params }),
};