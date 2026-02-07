// Routes are relative paths; axios baseURL handles the base (e.g., /api)
export const API_ROUTES = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    VERIFY_EMAIL: "auth/verify-email",
    RESEND_VERIFICATION: "auth/resend-verification",
    LOGOUT: "auth/logout",
    STATUS: "auth/status",
    REFRESH_TOKEN: "auth/refresh-token",
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
    ALL: "categories/",
    // !TODO
    // BY_ID: (id: string) => `categories/${id}`,
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
