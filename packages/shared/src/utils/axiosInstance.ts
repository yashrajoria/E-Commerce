import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_ROUTES } from '../api/apiRoutes';

/**
 * Shared Axios instance used for browser API calls.
 *
 * @remarks
 * Configured with `withCredentials` and no `baseURL`, so requests stay
 * same-origin and carry the HttpOnly session cookies. Interceptors attach the
 * active store id as an `X-Store-ID` header, retry a request once after a
 * silent token refresh on `401`, and forward `403`/`429`/`5xx` failures to
 * the handler registered with {@link setAPIErrorHandler}.
 */
export const axiosInstance = axios.create({
  baseURL: undefined,
  withCredentials: true,
});

/**
 * Error categories passed to an {@link APIErrorHandler}.
 *
 * @remarks
 * The shared response interceptor reports `FORBIDDEN` (403), `RATE_LIMITED`
 * (429) and `SERVER_ERROR` (5xx); `NOT_FOUND` is reserved for consumers that
 * surface 404s themselves.
 */
export type APIErrorType = 'FORBIDDEN' | 'RATE_LIMITED' | 'NOT_FOUND' | 'SERVER_ERROR';

/**
 * Callback invoked when the shared axios instance sees a handled error response.
 *
 * @remarks
 * Register one per app with {@link setAPIErrorHandler} to surface toasts or
 * similar feedback.
 */
export type APIErrorHandler = (
  /** Normalized error category. */
  type: APIErrorType,
  /** Human-readable message supplied by the interceptor. */
  message: string,
  /** Optional backend payload carrying extra detail. */
  detail?: any,
) => void;

let errorHandler: APIErrorHandler | null = null;

let activeStoreId: string | null = null;

/**
 * Stores the active store id used by the request interceptor.
 *
 * @param storeId - Store identifier to send as `X-Store-ID`, or `null` to clear it.
 * @returns Nothing; the value is held in module memory.
 */
export const setActiveStoreId = (storeId: string | null) => {
  activeStoreId = storeId;
};

/**
 * Resolves the store id that outgoing requests should be scoped to.
 *
 * @returns The in-memory store id when set, otherwise the persisted
 * `shopswift_active_store_id` value in the browser, otherwise
 * `NEXT_PUBLIC_DEFAULT_STORE_ID` — or `null` when none is available.
 */
export const getActiveStoreId = (): string | null => {
  if (activeStoreId) return activeStoreId;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("shopswift_active_store_id");
      if (stored) return stored;
    } catch {
      // ignore local storage access issues
    }
  }
  return process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || null;
};

// Automatically attach active store ID header to outgoing requests
axiosInstance.interceptors.request.use((config) => {
  const storeId = getActiveStoreId();
  if (storeId && !config.headers["X-Store-ID"] && !config.headers["x-store-id"]) {
    config.headers["X-Store-ID"] = storeId;
  }
  return config;
});

/**
 * Registers the fallback handler for handled error responses.
 *
 * @param handler - Callback that receives the error category, message and optional detail.
 * @returns Nothing; the handler is held in module memory.
 */
export const setAPIErrorHandler = (handler: APIErrorHandler) => {
  errorHandler = handler;
};

/** Default storefront refresh; admin apps should override to `/api/admin/auth/refresh`. */
let authRefreshUrl = API_ROUTES.AUTH.REFRESH;

/**
 * Overrides the endpoint used for the silent `401` token refresh.
 *
 * @remarks
 * Defaults to the storefront refresh route in {@link API_ROUTES}; admin apps
 * call this once during setup with `/api/admin/auth/refresh`.
 *
 * @param url - Refresh endpoint to call when a request receives a `401`.
 * @returns Nothing; the URL is held in module memory.
 */
export const setAuthRefreshUrl = (url: string) => {
  authRefreshUrl = url;
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
      !originalRequest.url?.includes(authRefreshUrl) &&
      !originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH) &&
      !originalRequest.url?.includes(API_ROUTES.AUTH.LOGIN) &&
      !originalRequest.url?.includes('/admin/auth/login') &&
      !originalRequest.url?.includes('/admin/auth/refresh')
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
        await axios.post(authRefreshUrl, {}, { withCredentials: true });
        
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Only hard-logout when the server rejects the session — not on
        // transient network/proxy failures (those would falsely kick users out).
        const refreshStatus = (refreshError as AxiosError)?.response?.status;
        if (refreshStatus === 401 || refreshStatus === 403) {
          window.dispatchEvent(new Event('logout'));
        }
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
