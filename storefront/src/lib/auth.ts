import {
  login as sharedLogin,
  register as sharedRegister,
  guestAuth as sharedGuestAuth,
  verifyEmail as sharedVerifyEmail,
  resendVerificationEmail as sharedResendVerificationEmail,
  requestPasswordReset as sharedRequestPasswordReset,
  resetPassword as sharedResetPassword,
  refreshTokens as sharedRefreshTokens,
  validatePassword as sharedValidatePassword,
} from "@ecommerce/shared";
export type { PasswordValidation } from "@ecommerce/shared";

/**
 * Signs a user in with email and password through the shared auth client.
 *
 * @param email - Registered email address.
 * @param password - Account password.
 * @returns The auth-service response payload (token/session data) from the shared `login` helper.
 */
export const loginUser = async (email: string, password: string) =>
  sharedLogin(email, password);

/**
 * Creates a new account through the shared auth client.
 *
 * @param email - Email address for the new account.
 * @param password - Chosen password.
 * @param fullName - Display name stored on the account.
 * @returns The auth-service response payload from the shared `register` helper.
 */
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
) => sharedRegister(email, password, fullName);

/**
 * Authenticates a shopper as a guest (or starts guest checkout) via the shared auth client.
 *
 * @param email - Guest email address.
 * @param fullName - Optional guest display name.
 * @param phone - Optional contact phone number.
 * @returns The auth-service response payload from the shared `guestAuth` helper.
 */
export const guestAuth = async (
  email: string,
  fullName?: string,
  phone?: string,
) => sharedGuestAuth(email, fullName, phone);

/**
 * Verifies an account with the emailed one-time code.
 *
 * @param email - Email address being verified.
 * @param code - Verification code from the email.
 * @returns The auth-service response payload from the shared `verifyEmail` helper.
 */
export const verifyEmail = async (email: string, code: string) =>
  sharedVerifyEmail(email, code);

/**
 * Requests a fresh email verification code.
 *
 * @param email - Email address that needs a new code.
 * @returns The auth-service response payload from the shared `resendVerificationEmail` helper.
 */
export const resendVerificationEmail = async (email: string) =>
  sharedResendVerificationEmail(email);

/**
 * Requests a password-reset code by email.
 *
 * @param email - Email address to send the reset code to.
 * @returns The auth-service response payload from the shared `requestPasswordReset` helper.
 */
export const requestPasswordReset = async (email: string) =>
  sharedRequestPasswordReset(email);

/**
 * Completes a password reset with the emailed code and a new password.
 *
 * @param email - Email address owning the account.
 * @param code - Password-reset code from the email.
 * @param newPassword - Replacement password.
 * @returns The auth-service response payload from the shared `resetPassword` helper.
 */
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => sharedResetPassword(email, code, newPassword);

/**
 * Exchanges the refresh token for a fresh access token via the shared auth client.
 *
 * @returns The auth-service response payload with the refreshed tokens.
 */
export const refreshTokens = async () => sharedRefreshTokens();

/**
 * Checks password strength and rule compliance without calling the backend.
 *
 * @param password - Candidate password to evaluate.
 * @returns The {@link PasswordValidation} result with validity, error messages, and strength rating.
 */
export const validatePassword = (password: string) =>
  sharedValidatePassword(password);
