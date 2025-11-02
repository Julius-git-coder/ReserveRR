import apiClient from './client';

export const messagesAPI = {
  getTeamMessages: async (teamId) => {
    const response = await apiClient.get(`/messages/team/${teamId}`);
    return response.data;
  },

  getDirectMessages: async (userId) => {
    const response = await apiClient.get(`/messages/user/${userId}`);
    return response.data;
  },

  sendMessage: async (data) => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  broadcastMessage: async (data) => {
    const response = await apiClient.post('/messages/admins/message/broadcast', data);
    return response.data;
  },
};

