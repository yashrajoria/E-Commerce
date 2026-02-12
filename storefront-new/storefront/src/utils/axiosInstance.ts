import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { refreshTokens } from "@/lib/auth";

// Create the Axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
});

// A flag to prevent multiple, simultaneous refresh requests
let isRefreshing = false;
// A queue to hold requests that failed due to an expired token while a refresh is in progress
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if the route is protected
      const isProtectedRoute =
        originalRequest.url?.includes("/cart") ||
        originalRequest.url?.includes("/orders") ||
        originalRequest.url?.includes("/profile");

      if (isProtectedRoute) {
        window.dispatchEvent(new Event("logout"));
        return Promise.reject(error);
      }

      // Handle token refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          await refreshTokens(); // Refresh the token
          processQueue(null); // Retry all failed requests
          resolve(axiosInstance(originalRequest)); // Retry the original request
        } catch (err) {
          processQueue(err); // Reject all failed requests
          window.dispatchEvent(new Event("logout")); // Trigger logout
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  },
);
