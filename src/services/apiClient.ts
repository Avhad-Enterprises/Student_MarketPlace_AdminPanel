import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/api';
import { toast } from 'sonner';

/**
 * Centralized API client for the Student Marketplace.
 * Handles:
 * 1. Automatic Bearer Token injection from localStorage.
 * 2. Global interception of 403 Forbidden (RBAC violation).
 * 3. Global interception of 401 Unauthorized (Session expiry).
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Authorization Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized: Session expired or invalid token
          console.warn('[API] 401 Unauthorized: Session expired.');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden: RBAC violation
          console.error('[RBAC] 403 Forbidden: Access denied for this action.', data);
          toast.error('Permission Denied', {
            description: data?.message || "You don't have permission to perform this action.",
            duration: 5000,
          });
          break;

        case 500:
          console.error('[API] 500 Internal Server Error:', data);
          toast.error('Server Error', {
            description: 'Something went wrong on our end. Please try again later.',
          });
          break;

        default:
          break;
      }
    } else if (error.request) {
      // Network Error
      console.error('[API] Network Error:', error.message);
      toast.error('Network Error', {
        description: 'Unable to connect to the server. Please check your internet connection.',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
