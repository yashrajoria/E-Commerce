import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";

// Create the Axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  withCredentials: true, // crucial for sending cookies
});

// Plain axios client for refresh calls (no interceptors)
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  withCredentials: true,
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

// Add request interceptor (reserved for future request customization)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Add the response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = (error.config as any) || {};

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh in progress
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use plain refreshClient (no interceptors) so refresh doesn't loop
        await refreshClient.post(API_ROUTES.AUTH.REFRESH_TOKEN);

        // Refresh succeeded; resolve queued requests
        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        console.error("Session expired, logging out.");
        window.dispatchEvent(new Event("logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
