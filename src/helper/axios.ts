import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8181/api/v1";

// Create main Axios instance for API requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Create a separate Axios instance for refresh token requests (no interceptors)
const refreshAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.defaults.withCredentials = true;

let isRefreshing = false;
let refreshAndRetryQueue: any[] = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // mark as retried to prevent loops
      originalRequest._retry = true; 
      
      // Skip interceptor for /auth/refresh to avoid infinite loop
      if (originalRequest.url === '/auth/refresh') {
        return Promise.reject(error);
      }
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const success = await handleRefreshToken();
          
          if (success) {
            // Resolve queued requests with new token
            refreshAndRetryQueue.forEach(({ resolve, config }) => {
              resolve(axiosInstance(config));
            });
            refreshAndRetryQueue = [];
            
            // Retry the original request
            return axiosInstance(originalRequest);
          } else {
            // Refresh failed, remove tokens and redirect to login
            handleAuthFailure();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Handle refresh failure
          handleAuthFailure();
          refreshAndRetryQueue.forEach(({ reject }) => reject(refreshError));
          refreshAndRetryQueue = [];
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Queue the request while refreshing
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ 
          resolve, 
          reject, 
          config: originalRequest 
        });
      });
    }
    
    return Promise.reject(error);
  }
);

function handleAuthFailure() {
  window.location.href = '/';
}

async function handleRefreshToken() {
  try {
    // Use refreshAxiosInstance to avoid interceptor
    await refreshAxiosInstance.post('/auth/refresh', {});

    return true;
  } catch (error) {
    console.error('Refresh token failed:', error);
    return false;
  }
}

export default axiosInstance;