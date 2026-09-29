// Keep browser requests same-origin so HttpOnly cookies are attached.
// API routes are proxied by Next.js to the backend.
const API_BASE_URL = '/api';

// small helper to ensure consistent path joining
const route = (path: string) =>
  `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

export const API_ROUTES = {
  AUTH: {
    LOGIN: route('/user/auth/login'),
    REGISTER: route('/user/auth/register'),
    VERIFY_EMAIL: route('/user/auth/verify-email'),
    RESEND_VERIFICATION: route('/bff/auth/resend-verification'),
    REFRESH: route('/user/auth/refresh'),
    REQUEST_PASSWORD_RESET: route('/bff/auth/request-password-reset'),
    RESET_PASSWORD: route('/bff/auth/reset-password'),
    LOGOUT: route('/user/auth/logout'),
    STATUS: route('/user/auth/status'),
  },

  USER: {
    PROFILE: route('/user/profile'),
    UPDATE_PASSWORD: route('/user/profile/change-password'),
    UPDATE_USER_DATA: route('/user/profile'),
  },

  PRODUCTS: {
    ALL: route('/user/products'),
    BY_ID: (id: string) => route(`/user/products/${id}`),
  },

  CATEGORIES: {
    ALL: route('/user/categories'),
  },

  ORDERS: {
    ALL: route('/user/orders'),
    BY_ID: (id: string) => route(`/user/orders/${id}`),
  },

  CART: {
    ALL: route('/user/cart'),
    ADD: route('/user/cart/add'),
    REMOVE: (id: string) => route(`/user/cart/remove/${id}`),
    CLEAR: route('/user/cart/clear'),
    CHECKOUT: route('/user/cart/checkout'),
  },

  PAYMENT: {
    STATUS_BY_ORDER: (id: string) =>
      route(`/user/payment/status/by-order/${id}`),
    VERIFY: route('/user/payment/verify-payment'),
  },
};

export default API_ROUTES;
