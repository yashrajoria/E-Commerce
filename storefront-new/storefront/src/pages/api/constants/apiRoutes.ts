const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  // "https://lawana-indexless-terese.ngrok-free.dev";
  "http://localhost:8080";

// small helper to ensure consistent path joining
const route = (path: string) =>
  `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

export const API_ROUTES = {
  AUTH: {
    LOGIN: route("/auth/login"),
    REGISTER: route("/auth/register"),
    VERIFY_EMAIL: route("/auth/verify-email"),
    RESEND_VERIFICATION: route("/auth/resend-verification"),
    REFRESH: route("/auth/refresh"),
    REQUEST_PASSWORD_RESET: route("/auth/request-password-reset"),
    RESET_PASSWORD: route("/auth/reset-password"),
    LOGOUT: route("/auth/logout"),
    STATUS: route("/auth/status"),
  },

  USER: {
    PROFILE: route("/users/profile"),
    UPDATE_PASSWORD: route("/users/change-password"),
    UPDATE_USER_DATA: route("/users/profile"),
  },

  PRODUCTS: {
    ALL: route("/products"),
    BY_ID: (id: string) => route(`/products/${id}`),
  },

  CATEGORIES: {
    ALL: route("/categories"),
  },

  ORDERS: {
    ALL: route("/orders"),
    BY_ID: (id: string) => route(`/orders/${id}`),
  },

  CART: {
    ADD: route("/cart/add"),
    CHECKOUT: route("/cart/checkout"),
  },

  PAYMENT: {
    STATUS_BY_ORDER: (id: string) => route(`/payment/status/by-order/${id}`),
    VERIFY: route("/payment/verify-payment"),
  },
};
