import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error('❌ API Error Response:', {
        status,
        message: data?.message || data?.detail || 'Unknown error',
        url: error.config?.url
      });
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          // window.location.href = '/login';
          console.warn('Unauthorized - Token cleared');
          break;
          
        case 403:
          console.error('Access forbidden - Insufficient permissions');
          break;
          
        case 404:
          console.error('Resource not found');
          break;
          
        case 422:
          console.error('Validation error:', data?.detail);
          break;
          
        case 500:
          console.error('Internal server error');
          break;
          
        case 503:
          console.error('Service unavailable');
          break;
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || data?.detail || 'An error occurred',
        data: data,
        originalError: error
      });
      
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response received:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error - No response from server',
        originalError: error
      });
      
    } else {
      // Something else happened
      console.error('❌ Request Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'Request failed',
        originalError: error
      });
    }
  }
);

export default api;