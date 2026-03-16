import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { NextRouter } from "next/router";

// To prevent multiple token refresh requests if several API calls fail at the same time
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupGlobalAxiosInterceptors = (router: NextRouter) => {
  // Clear any existing interceptors to prevent duplicates on hot-reload/re-renders
  axios.interceptors.response.clear();

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Ensure we only retry requests that failed with 401 Unauthorized
      // and haven't already been retried
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        // Prevent infinite loops if the refresh endpoint itself throws 401
        !originalRequest.url?.includes("/api/auth/refresh") &&
        !originalRequest.url?.includes("/api/auth/login")
      ) {
        if (isRefreshing) {
          // If a refresh is already in progress, queue this request
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token via Next.js proxy
          // This endpoint will use the HTTP-only refresh_token cookie
          // to request a new access_token cookie from the backend.
          await axios.post("/api/auth/refresh", {}, { withCredentials: true });

          // Refresh successful, process queue and retry original request
          processQueue(null);
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed (e.g., refresh_token expired or invalid)
          processQueue(refreshError as Error);
          
          // Redirect the user to login since they are completely logged out
          // Using window.location instead of router to force a full hard reload 
          // to clear global states
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // For all other errors, just return the exact error
      return Promise.reject(error);
    }
  );
};
