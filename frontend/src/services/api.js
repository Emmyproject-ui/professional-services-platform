import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/project/backend/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - redirect to home
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 422:
          // Validation error - will be handled by component
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register.php', data),
  login: (data) => api.post('/auth/login.php', data),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products/index.php'),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders/index.php', data),
  getMyOrders: () => api.get('/orders/index.php'),
};

// Admin API
export const adminAPI = {
  getAllOrders: () => api.get('/admin/orders.php'),
  updateOrderStatus: (orderId, status) => api.patch(`/admin/orders.php/${orderId}`, { status }),
  getStatistics: () => api.get('/admin/statistics.php'),
};

export default api;
