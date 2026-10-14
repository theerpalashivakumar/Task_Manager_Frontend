import api from './api';

const explanationService = {
  verifyPassword: (password) => api.post('/project-explanation/verify', { password }),
  getContent: () => api.get('/project-explanation/content'),
};

export default explanationService;
