import api from './api';

export const authService = {
  login: async (username, password) => {
    // Returns ApiResponse<LoginResponse> where data contains accessToken and user details
    const response = await api.post('/api/v1/auth/login', { username, password });
    return response; // { success, message, data: { accessToken, username, role, email, fullName } }
  },

  register: async (username, password, fullName, email, role = 'USER') => {
    const response = await api.post('/api/v1/auth/register', {
      username,
      password,
      fullName,
      email,
      role,
    });
    return response;
  },
};
