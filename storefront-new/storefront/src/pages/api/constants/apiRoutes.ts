const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  "http://localhost:8080";

// small helper to ensure consistent path joining
const route = (path: string) =>
  `${API_BASE_URL.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

export const API_ROUTES = {
  AUTH: {
    // All auth goes via BFF public/protected routes (see api-gateway routes.go).
    LOGIN: route("/bff/auth/login"),
    REGISTER: route("/bff/auth/register"),
    VERIFY_EMAIL: route("/bff/auth/verify-email"),
    RESEND_VERIFICATION: route("/bff/auth/resend-verification"),
    REFRESH: route("/bff/auth/refresh"),
    REQUEST_PASSWORD_RESET: route("/bff/auth/request-password-reset"),
    RESET_PASSWORD: route("/bff/auth/reset-password"),
    LOGOUT: route("/bff/auth/logout"),
    STATUS: route("/bff/auth/status"),
  },

  USER: {
    PROFILE: route("/bff/profile"),
    UPDATE_PASSWORD: route("/bff/users/change-password"),
    UPDATE_USER_DATA: route("/bff/users/profile"),
  },

  PRODUCTS: {
    ALL: route("/bff/products"),
    BY_ID: (id: string) => route(`/bff/products/${id}`),
  },

  CATEGORIES: {
    ALL: route("/bff/categories"),
  },

  ORDERS: {
    ALL: route("/bff/orders"),
    BY_ID: (id: string) => route(`/bff/orders/${id}`),
  },

  CART: {
    ADD: route("/bff/cart/add"),
    CHECKOUT: route("/bff/checkout"),
  },

  PAYMENT: {
    STATUS_BY_ORDER: (id: string) => route(`/bff/payment/status/by-order/${id}`),
    VERIFY: route("/bff/payment/verify-payment"),
  },
};
