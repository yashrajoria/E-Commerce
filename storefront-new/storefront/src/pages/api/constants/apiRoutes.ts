const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  // "https://lawana-indexless-terese.ngrok-free.dev";
  "http://localhost:8080";

// small helper to ensure consistent path joining
const route = (path: string) =>
  `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

export const API_ROUTES = {
  AUTH: {
    // LOGIN: route("/bff/auth/login"),
    // REGISTER: route("/bff/auth/register"),
    LOGIN: route("/auth/login"),
    REGISTER: route("/auth/register"),
    VERIFY_EMAIL: route("/bff/auth/verify-email"),
    RESEND_VERIFICATION: route("/bff/auth/resend-verification"),
    REFRESH: route("/bff/auth/refresh"),
    REQUEST_PASSWORD_RESET: route("/bff/auth/request-password-reset"),
    RESET_PASSWORD: route("/bff/auth/reset-password"),
    LOGOUT: route("/bff/auth/logout"),
    STATUS: route("/bff/auth/status"),
  },

  USER: {
    // PROFILE: route("/users/profile"),
    PROFILE: route("/bff/profile"),
    // UPDATE_PASSWORD: route("/users/change-password"),
    // UPDATE_USER_DATA: route("/users/profile"),
    UPDATE_PASSWORD: route("/bff/change-password"),
    UPDATE_USER_DATA: route("/bff/profile"),
  },

  PRODUCTS: {
    // ALL: route("/bff/products"),
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
