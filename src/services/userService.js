import api from './api';

const userService = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  toggleStatus: (id) => api.patch(`/users/${id}/status`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default userService;
