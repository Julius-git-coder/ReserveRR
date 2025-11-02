import apiClient from './client';

export const uploadsAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

