import apiClient from './client';

export const uploadsAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
    } catch (error) {
      // Re-throw with more context
      if (error.response) {
        // Server responded with error status
        throw {
          ...error,
          response: {
            ...error.response,
            data: {
              ...error.response.data,
              message: error.response.data?.message || 'File upload failed',
            },
          },
        };
      } else if (error.request) {
        // Request was made but no response received
        throw {
          ...error,
          message: 'Unable to connect to server. Please check your internet connection.',
        };
      } else {
        // Error setting up the request
        throw {
          ...error,
          message: error.message || 'Failed to upload file',
        };
      }
    }
  },
};

