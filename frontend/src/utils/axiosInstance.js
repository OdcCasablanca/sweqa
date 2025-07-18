import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5005/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15005, // 15 seconds timeout
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
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

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.headers['content-type']?.includes('text/html')) {
      return Promise.reject(new Error('Invalid response format'));
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    if (error.response.headers['content-type']?.includes('text/html')) {
      // Server returned HTML instead of JSON
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Handle specific error codes
    switch (error.response.status) {
      case 404:
        return Promise.reject(new Error('Resource not found'));
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Unauthorized access'));
      case 500:
        return Promise.reject(new Error('Server error. Please try again later.'));
      default:
        return Promise.reject(error);
    }
  }
);

export default axiosInstance; 