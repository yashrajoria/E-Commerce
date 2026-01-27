import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "./constants/apiRoutes";

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, {
    email,
    password,
    role: "user",
  });
  return response.data;
};

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
    email,
    password,
    name: fullName,
    role: "user",
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
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, { email, code, new_password: newPassword });
  return response.data;
};

export const refreshTokens = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH);
  return response.data;
};

// Password validation helper
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
