import api from './api';

const aiService = {
  suggestTask: async ({ title, description, projectContext }) => {
    return api.post('/ai/suggest-task', { title, description, projectContext });
  },

  analyzeProject: async (projectId) => {
    return api.get(`/ai/project-analysis/${projectId}`);
  },
};

export default aiService;
