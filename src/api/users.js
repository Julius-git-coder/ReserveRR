import apiClient from './client';

export const usersAPI = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  getTeamMembers: async () => {
    const response = await apiClient.get('/users/team/members');
    return response.data;
  },

  getAdminByTeamId: async (teamId) => {
    const response = await apiClient.get(`/users/admins/team/${teamId}`);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await apiClient.get('/users/admins/me/stats');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await apiClient.delete(`/users/admins/students/${studentId}`);
    return response.data;
  },

  updateStudentStatus: async (studentId, status) => {
    const response = await apiClient.put(`/users/admins/students/${studentId}/status`, { status });
    return response.data;
  },
};

