import api from './api';

const projectService = {
  getProjects: (params = {}) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.patch(`/projects/${id}`, data),
  manageMembers: (id, memberPayload) => api.patch(`/projects/${id}/members`, memberPayload),
  toggleArchive: (id) => api.patch(`/projects/${id}/archive`),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getProjectActivity: (id) => api.get(`/projects/${id}/activity`),
};

export default projectService;
