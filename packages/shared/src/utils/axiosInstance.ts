import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ROUTES } from '../api/apiRoutes';

// Create the Axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: undefined,
  withCredentials: true,
});

/** 
 * Types for the error callbacks that apps can register 
 */
export type APIErrorType = 'FORBIDDEN' | 'RATE_LIMITED' | 'NOT_FOUND' | 'SERVER_ERROR';

export type APIErrorHandler = (type: APIErrorType, message: string, detail?: any) => void;

let errorHandler: APIErrorHandler | null = null;

export const setAPIErrorHandler = (handler: APIErrorHandler) => {
  errorHandler = handler;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 1. Handle 401 Unauthorized - Token Refresh Logic
    if (
      error.response?.status === 401 && 
      originalRequest && 
      !originalRequest._retry &&
      // Prevent loops if refresh or login themselves fail with 401
      !originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH) &&
      !originalRequest.url?.includes(API_ROUTES.AUTH.LOGIN)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a plain axios call to the refresh endpoint to avoid cycles
        // This relies on HTTP-only cookies being sent by the browser.
        await axios.post(API_ROUTES.AUTH.REFRESH, {}, { withCredentials: true });
        
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // If refresh fails, they are definitely logged out
        window.dispatchEvent(new Event('logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Global Error Handling (403, 429, etc.)
    if (error.response && errorHandler) {
      const status = error.response.status;
      
      if (status === 403) {
        errorHandler('FORBIDDEN', "You don't have permission to perform this action");
      } else if (status === 429) {
        errorHandler('RATE_LIMITED', "Too many requests. Please try again later.");
      } else if (status >= 500) {
        errorHandler('SERVER_ERROR', "A server error occurred. Please try again later.");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
