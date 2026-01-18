import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";

// Create the Axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies
});

// A flag to prevent multiple, simultaneous refresh requests
let isRefreshing = false;
// A queue to hold requests that failed due to an expired token while a refresh is in progress
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add the response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;

    // Check if the error is 401 (Unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the original request once the token has been refreshed
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the tokens by calling the refresh endpoint
        // await axiosInstance.post(API_ROUTES.AUTH.REFRESH);

        // Process the queue of failed requests, retrying them with the new token
        processQueue(null);

        // Retry the original request that initiated the refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If the refresh token is also invalid, the refresh attempt will fail.
        // Dispatch a global 'logout' event for the UserContext to catch.
        console.error("Session expired, logging out.");
        window.dispatchEvent(new Event("logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For any other errors, just return the promise rejection
    return Promise.reject(error);
  }
);
