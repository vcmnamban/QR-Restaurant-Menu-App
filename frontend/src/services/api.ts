import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '@/utils';

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to headers
    const token = storage.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header
    const language = storage.get('language') || 'en';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      storage.remove('authToken');
      storage.remove('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Handle insufficient permissions
      console.error('Access denied: Insufficient permissions');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// HTTP Methods
export const http = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // File upload
  upload: async <T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Multiple file upload
  uploadMultiple: async <T = any>(url: string, files: File[], config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      const response = await api.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

// Error handler
function handleApiError(error: any): ApiResponse {
  console.log('🔍 API Error Handler - Error:', error);
  console.log('🔍 API Error Handler - Error response:', error.response);
  console.log('🔍 API Error Handler - Error response data:', error.response?.data);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    console.log('🔍 API Error Handler - Status:', status);
    console.log('🔍 API Error Handler - Data:', data);
    
    return {
      success: false,
      error: data?.error?.message || data?.error || data?.message || `HTTP ${status} Error`,
      message: data?.message || data?.error?.message || 'An error occurred',
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      error: 'Network Error',
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: 'Request Error',
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Export the axios instance for direct use if needed
export { api };

// Export default HTTP methods
export default http;
