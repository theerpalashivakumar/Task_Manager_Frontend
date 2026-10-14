import api from './api';

const taskService = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.patch(`/tasks/${id}`, data),
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getComments: (id) => api.get(`/tasks/${id}/comments`),
  addComment: (id, comment) => api.post(`/tasks/${id}/comments`, { comment }),
  getTaskActivity: (id) => api.get(`/tasks/${id}/activity`),
};

export default taskService;
