import { refreshTokens } from "@/lib/auth";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create the Axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "http://localhost:8080"
  ).replace(/\/+$/, ""),
  withCredentials: true, // This is crucial for sending cookies
});

// A flag to prevent multiple, simultaneous refresh requests
let isRefreshing = false;
// A queue to hold requests that failed due to an expired token while a refresh is in progress
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Accept `unknown` because `catch` clauses produce `unknown`-typed errors.
const processQueue = (error: unknown | null) => {
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
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; url?: string };
    const requestUrl = originalRequest.url ?? "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/status") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/resend-verification");

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Auth endpoints can legitimately return 401 when no session is present.
      // Avoid refresh recursion for these cases.
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Always attempt a token refresh first for non-auth 401s.
      // Only dispatch logout after refresh fails (and only in the browser).
      const dispatchLogout = () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("logout"));
        }
      };

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
          dispatchLogout(); // Trigger logout (browser only)
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  },
);
