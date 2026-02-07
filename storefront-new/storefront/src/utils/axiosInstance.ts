import axios, { AxiosError } from "axios";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { refreshTokens } from "@/pages/api/auth";

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
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
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

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.id) {
            config.headers = config.headers ?? {};
            config.headers["X-User-ID"] = userData.id;
          }
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If it's a protected route, trigger logout immediately
      const isProtectedRoute =
        originalRequest.url?.includes('/cart') ||
        originalRequest.url?.includes('/orders') ||
        originalRequest.url?.includes('/profile');

      if (isProtectedRoute) {
        window.dispatchEvent(new Event('logout'));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          await refreshTokens();
          processQueue();
          resolve(axiosInstance(originalRequest));
        } catch (err) {
          processQueue(err);
          window.dispatchEvent(new Event('logout'));
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
