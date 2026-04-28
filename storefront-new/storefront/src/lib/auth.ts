import {
  login as sharedLogin,
  register as sharedRegister,
  verifyEmail as sharedVerifyEmail,
  resendVerificationEmail as sharedResendVerificationEmail,
  requestPasswordReset as sharedRequestPasswordReset,
  resetPassword as sharedResetPassword,
  refreshTokens as sharedRefreshTokens,
  validatePassword as sharedValidatePassword,
} from "@ecommerce/shared";
export type { PasswordValidation } from "@ecommerce/shared";

export const loginUser = async (email: string, password: string) =>
  sharedLogin(email, password);

export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
) => sharedRegister(email, password, fullName);

export const verifyEmail = async (email: string, code: string) =>
  sharedVerifyEmail(email, code);

export const resendVerificationEmail = async (email: string) =>
  sharedResendVerificationEmail(email);

export const requestPasswordReset = async (email: string) =>
  sharedRequestPasswordReset(email);

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => sharedResetPassword(email, code, newPassword);

export const refreshTokens = async () => sharedRefreshTokens();

export const validatePassword = (password: string) =>
  sharedValidatePassword(password);
