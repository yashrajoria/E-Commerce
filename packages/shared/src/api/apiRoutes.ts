// Keep browser requests same-origin so HttpOnly cookies are attached.
// API routes are proxied by Next.js to the backend.
const API_BASE_URL = '/api';

// small helper to ensure consistent path joining
const route = (path: string) =>
  `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

/**
 * Same-origin API route map shared by the storefront and admin apps.
 *
 * @remarks
 * Every path is prefixed with `/api` so browser requests stay same-origin and
 * HttpOnly cookies are attached; the Next.js apps proxy the paths on to the
 * backend. Static entries are strings, while resource-specific entries (for
 * example `BY_ID`) are factory functions that interpolate an identifier.
 */
export const API_ROUTES = {
  /** Authentication endpoints (login, registration, guest auth, email verification, password reset, token refresh, logout, status). */
  AUTH: {
    LOGIN: route('/user/auth/login'),
    REGISTER: route('/user/auth/register'),
    GUEST: route('/user/auth/guest'),
    VERIFY_EMAIL: route('/user/auth/verify-email'),
    RESEND_VERIFICATION: route('/user/auth/resend-verification'),
    REFRESH: route('/user/auth/refresh'),
    REQUEST_PASSWORD_RESET: route('/bff/auth/request-password-reset'),
    RESET_PASSWORD: route('/bff/auth/reset-password'),
    LOGOUT: route('/user/auth/logout'),
    STATUS: route('/user/auth/status'),
  },

  /** Profile endpoints for the signed-in user (read profile, change password, update user data). */
  USER: {
    PROFILE: route('/user/profile'),
    UPDATE_PASSWORD: route('/user/profile/change-password'),
    UPDATE_USER_DATA: route('/user/profile'),
  },

  /** Product catalogue endpoints for the storefront. */
  PRODUCTS: {
    ALL: route('/user/products'),
    BY_ID: (id: string) => route(`/user/products/${id}`),
  },

  /** Category listing endpoints. */
  CATEGORIES: {
    ALL: route('/user/categories'),
  },

  /** Order history endpoints for the signed-in user. */
  ORDERS: {
    ALL: route('/user/orders'),
    BY_ID: (id: string) => route(`/user/orders/${id}`),
  },
  /** Store-credit balance and ledger endpoints. */
  STORE_CREDIT: {
    BALANCE: route('/user/store-credit/balance'),
    LEDGER: route('/user/store-credit/ledger'),
  },

  /** Shopping-cart endpoints (read, add, remove, clear, checkout). */
  CART: {
    ALL: route('/user/cart'),
    ADD: route('/user/cart/add'),
    REMOVE: (id: string) => route(`/user/cart/remove/${id}`),
    CLEAR: route('/user/cart/clear'),
    CHECKOUT: route('/user/cart/checkout'),
  },

  /** Payment status and verification endpoints. */
  PAYMENT: {
    STATUS_BY_ORDER: (id: string) =>
      route(`/user/payment/status/by-order/${id}`),
    VERIFY: route('/user/payment/verify-payment'),
  },
  
  /** Promotion validation and listing endpoints. */
  PROMOTIONS: {
    VALIDATE: route('/user/promotions/validate'),
    LIST: route('/user/promotions'), // Admin only via /bff/admin/promotions
  },
};

export default API_ROUTES;
