// Routes are relative paths; axios baseURL handles the base (e.g., /api)
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
    RESEND_VERIFICATION: `${BASE_URL}/auth/resend-verification`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    REQUEST_PASSWORD_RESET: `${BASE_URL}/auth/request-password-reset`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    STATUS: `${BASE_URL}/auth/status`,
  },
  USER: {
    PROFILE: "users/profile/",
    UPDATE_PASSWORD: "users/change-password",
    UPDATE_USER_DATA: "users/profile",
  },

  PRODUCTS: {
    ALL: "products",
    BY_ID: (id: string) => `products/${id}`,
  },

  CATEGORIES: {
    ALL: `${BASE_URL}/categories/`,
  },

  ORDERS: {
    ALL: "orders",
    BY_ID: (id: string) => `orders/${id}`,
  },
  CART: {
    ADD: "cart/add",
    CHECKOUT: "cart/checkout",
  },
  PAYMENT: {
    STATUS_BY_ORDER: (id: string) => `payment/status/by-order/${id}`,
    VERIFY: "payment/verify-payment",
  },
};
