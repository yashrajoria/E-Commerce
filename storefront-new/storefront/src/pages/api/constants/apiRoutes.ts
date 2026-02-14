const API_BASE_URL = "http://localhost:8080";
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    REQUEST_PASSWORD_RESET: `${API_BASE_URL}/auth/request-password-reset`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    STATUS: `${API_BASE_URL}/auth/status`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    UPDATE_USER_DATA: `${API_BASE_URL}/users/profile`,
  },

  PRODUCTS: {
    ALL: `${API_BASE_URL}/products`,
    BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
  },

  CATEGORIES: {
    ALL: `${API_BASE_URL}/categories/`,
  },

  ORDERS: {
    ALL: `${API_BASE_URL}/orders`,
    BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },
  CART: {
    ADD: `${API_BASE_URL}/cart/add`,
    CHECKOUT: `${API_BASE_URL}/cart/checkout`,
  },
  PAYMENT: {
    STATUS_BY_ORDER: (id: string) =>
      `${API_BASE_URL}/payment/status/by-order/${id}`,
    VERIFY: `${API_BASE_URL}/payment/verify-payment`,
  },
};
