import { apiClient } from '@/services/apiClient';

/**
 * Room Categories / Types endpoints.
 */
export const roomTypeAPI = {
  getAll: () => apiClient.get('/room-types'),
  getById: (id) => apiClient.get(`/room-types/${id}`),
  create: (data) => apiClient.post('/room-types', data),
  update: (id, data) => apiClient.put(`/room-types/${id}`, data),
  delete: (id) => apiClient.delete(`/room-types/${id}`),
  getAllWithFacilities: () => apiClient.get('/room-types/with-facilities'),
};

/**
 * Individual physical rooms endpoints.
 */
export const roomAPI = {
  getAll: () => apiClient.get('/rooms'),
  getById: (id) => apiClient.get(`/rooms/${id}`),
  create: (data) => apiClient.post('/rooms', data),
  update: (id, data) => apiClient.put(`/rooms/${id}`, data),
  delete: (id) => apiClient.delete(`/rooms/${id}`),
  getAvailable: (params) => apiClient.get('/rooms/available', { params }),
  getAllWithRoomType: () => apiClient.get('/rooms/with-room-type'),
};

/**
 * Hotel facilities endpoints.
 */
export const facilityAPI = {
  getAll: () => apiClient.get('/facilities'),
  getById: (id) => apiClient.get(`/facilities/${id}`),
  create: (data) => apiClient.post('/facilities', data),
  update: (id, data) => apiClient.put(`/facilities/${id}`, data),
  delete: (id) => apiClient.delete(`/facilities/${id}`),
};

/**
 * Room availability and statistical endpoints.
 */
export const roomAvailabilityAPI = {
  getStats: (params) => apiClient.get('/room-availability/stats', { params }),
  getAvailability: (params) => apiClient.get('/room-availability', { params }),
};