import apiClient from './client';

export const usersAPI = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  getTeamMembers: async (teamId) => {
    const response = await apiClient.get(`/users/admins/${teamId}/members`);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await apiClient.get('/users/admins/me/stats');
    return response.data;
  },
};

