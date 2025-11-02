import apiClient from './client';

export const authAPI = {
  adminSignup: async (data) => {
    const response = await apiClient.post('/auth/admin/signup', data);
    return response.data;
  },

  studentSignup: async (data) => {
    const response = await apiClient.post('/auth/student/signup', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};

