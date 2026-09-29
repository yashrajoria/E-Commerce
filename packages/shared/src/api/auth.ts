import { axiosInstance } from '../utils/axiosInstance';
import { API_ROUTES } from './apiRoutes';

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role?: string;
  created_at?: string;
  profile?: {
    name?: string;
    email?: string;
    phone_number?: string;
    avatar?: string;
    created_at?: string;
    [key: string]: unknown;
  };
  orders?: any;
  wishlist?: any[];
  totalSpent?: number;
  [k: string]: unknown;
} | null;

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, name?: string, role?: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
    email,
    password,
    name,
    role,
  });
  return response.data;
};

export const verifyEmail = async (email: string, code: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, {
    email,
    code,
  });
  return response.data;
};

export const resendVerificationEmail = async (email: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESEND_VERIFICATION, { email });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REQUEST_PASSWORD_RESET, { email });
  return response.data;
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
    email,
    code,
    new_password: newPassword,
  });
  return response.data;
};

export const refreshTokens = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  // trigger a frontend logout event for other clients
  window.dispatchEvent(new Event('logout'));
  return response.data;
};

export const checkStatus = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.AUTH.STATUS);
    return response.data;
  } catch (err) {
    return { authenticated: false };
  }
};

export const getUserData = async () => {
  const response = await axiosInstance.get(API_ROUTES.USER.PROFILE);
  return response.data;
};

// Password validation helper (copied from storefront for parity)
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  const isValid = errors.length === 0;

  if (isValid) {
    if (password.length >= 12 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'medium';
    }
  }

  return { isValid, errors, strength };
};

export const updateUserData = async (data: Record<string, unknown>) => {
  const response = await axiosInstance.put(API_ROUTES.USER.UPDATE_USER_DATA, data);
  return response.data;
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
  const response = await axiosInstance.post(API_ROUTES.USER.UPDATE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

export default {
  login,
  register,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  refreshTokens,
  logout,
  checkStatus,
  getUserData,
  validatePassword,
  updateUserData,
  updatePassword,
};
