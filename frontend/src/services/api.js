import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap standard backend ApiResponse structure
api.interceptors.response.use(
  (response) => {
    // If backend returns custom ApiResponse structure { success: boolean, message: string, data: any }
    if (response.data && response.data.hasOwnProperty('success')) {
      if (response.data.success) {
        return response.data; // This returns the whole payload including message and data
      } else {
        return Promise.reject(new Error(response.data.message || 'API Error'));
      }
    }
    return response.data;
  },
  (error) => {
    // Session expiration handling (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Extract error message and potential sub-errors array from the backend
    let message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      message = `${message}: ${error.response.data.errors.join(', ')}`;
    }
    
    const err = new Error(message);
    err.status = error.response?.status;
    err.data = error.response?.data;
    
    return Promise.reject(err);
  }
);

export default api;
