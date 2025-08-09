const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  USER: {
    PROFILE: `${BASE_URL}/users/profile`,
    UPDATE_PASSWORD: `${BASE_URL}/users/change-password`,
    UPDATE_USER_DATA: `${BASE_URL}/users/profile`,
  },

  PRODUCTS: {
    ALL: `${BASE_URL}/products`,
    BY_ID: (id: string) => `${BASE_URL}/products/${id}`,
  },

  CATEGORIES: {
    ALL: `${BASE_URL}/categories/`,
    // !TODO
    // BY_ID: (id: string) => `${BASE_URL}/categories/${id}`,
  },

  ORDERS: {
    ALL: `${BASE_URL}/orders`,
    BY_ID: (id: string) => `${BASE_URL}/orders/${id}`,
  },
};
