import { axiosInstance } from '../utils/axiosInstance';
import { API_ROUTES } from './apiRoutes';

/**
 * User account shape returned by the auth and profile endpoints.
 *
 * @remarks
 * `null` represents a signed-out or anonymous visitor. Extra keys are
 * permitted so backend-specific fields do not break consumers.
 */
export type User = {
  /** Unique user identifier. */
  id: string;
  /** Account email address. */
  email: string;
  /** Display name, when set. */
  name?: string;
  /** Avatar image URL, or `null` when the user has none. */
  avatar?: string | null;
  /** Role assigned by the backend (for example `user` or `admin`). */
  role?: string;
  /** ISO timestamp of account creation. */
  created_at?: string;
  /** Nested profile record returned by some endpoints. */
  profile?: {
    /** Display name on the profile record. */
    name?: string;
    /** Email on the profile record. */
    email?: string;
    /** Contact phone number. */
    phone_number?: string;
    /** Profile avatar URL. */
    avatar?: string;
    /** ISO timestamp of profile creation. */
    created_at?: string;
    /** Additional backend-specific profile fields. */
    [key: string]: unknown;
  };
  /** Orders payload when the endpoint embeds order history (backend-defined shape). */
  orders?: any;
  /** Wishlist entries when the endpoint embeds them (backend-defined item shape). */
  wishlist?: any[];
  /** Lifetime spend attributed to the user. */
  totalSpent?: number;
  /** Additional backend-specific fields. */
  [k: string]: unknown;
} | null;

/**
 * Signs in with email and password and starts an authenticated session.
 *
 * @param email - Account email address.
 * @param password - Account password.
 * @returns The response body from the login endpoint (session and user payload).
 * @throws {@link AxiosError} When the request rejects, for example on invalid credentials or a network failure.
 */
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};

/**
 * Creates a new account and starts a session.
 *
 * @param email - Account email address.
 * @param password - Account password.
 * @param name - Optional display name; the backend assigns the default user role.
 * @returns The response body from the registration endpoint.
 * @throws {@link AxiosError} When the request rejects, for example when the email is already registered.
 */
export const register = async (email: string, password: string, name?: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
    email,
    password,
    name,
    // role is never client-controlled — backend assigns the default user role
  });
  return response.data;
};

/**
 * Starts a guest checkout session for an email address.
 *
 * @param email - Guest email address.
 * @param name - Optional guest display name.
 * @param phone - Optional contact phone number.
 * @returns The response body from the guest-auth endpoint (guest session payload).
 * @throws {@link AxiosError} When the request rejects.
 */
export const guestAuth = async (email: string, name?: string, phone?: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.GUEST, {
    email,
    name,
    phone,
  });
  return response.data;
};

/**
 * Confirms an email address with the code sent by the backend.
 *
 * @param email - Email address being verified.
 * @param code - Verification code from the email.
 * @returns The response body from the verification endpoint.
 * @throws {@link AxiosError} When the request rejects, for example on an invalid or expired code.
 */
export const verifyEmail = async (email: string, code: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, {
    email,
    code,
  });
  return response.data;
};

/**
 * Requests a fresh email-verification code.
 *
 * @param email - Email address awaiting verification.
 * @returns The response body from the resend endpoint.
 * @throws {@link AxiosError} When the request rejects.
 */
export const resendVerificationEmail = async (email: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESEND_VERIFICATION, { email });
  return response.data;
};

/**
 * Requests a password-reset code for an email address.
 *
 * @param email - Email address that should receive the reset code.
 * @returns The response body from the password-reset request endpoint.
 * @throws {@link AxiosError} When the request rejects.
 */
export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REQUEST_PASSWORD_RESET, { email });
  return response.data;
};

/**
 * Completes a password reset with the emailed code.
 *
 * @param email - Email address being reset.
 * @param code - Reset code from the email.
 * @param newPassword - Replacement password.
 * @returns The response body from the reset endpoint.
 * @throws {@link AxiosError} When the request rejects, for example on an invalid or expired code.
 */
export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
    email,
    code,
    new_password: newPassword,
  });
  return response.data;
};

/**
 * Rotates the session cookies by calling the refresh endpoint.
 *
 * @returns The response body from the refresh endpoint (refreshed session payload).
 * @throws {@link AxiosError} When the request rejects, for example when the refresh token has expired.
 */
export const refreshTokens = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH);
  return response.data;
};

/**
 * Ends the backend session and notifies client-side listeners.
 *
 * @remarks
 * Dispatches a `logout` window event so other listeners (for example the
 * shared {@link AuthProvider}) can clear their client state.
 *
 * @returns The response body from the logout endpoint.
 * @throws {@link AxiosError} When the request rejects.
 */
export const logout = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  // trigger a frontend logout event for other clients
  window.dispatchEvent(new Event('logout'));
  return response.data;
};

/**
 * Checks whether the current browser session is authenticated.
 *
 * @returns The session status payload, or `{ authenticated: false }` when the check fails — this helper never rejects.
 */
export const checkStatus = async () => {
  try {
    const response = await axiosInstance.get(API_ROUTES.AUTH.STATUS);
    return response.data;
  } catch (err) {
    return { authenticated: false };
  }
};

/**
 * Fetches the signed-in user's profile record.
 *
 * @returns The response body from the profile endpoint.
 * @throws {@link AxiosError} When the request rejects, for example when the session has expired.
 */
export const getUserData = async () => {
  const response = await axiosInstance.get(API_ROUTES.USER.PROFILE);
  return response.data;
};

// Password validation helper (copied from storefront for parity)
/** Result of {@link validatePassword}: validity flag, unmet rules and an estimated strength. */
export interface PasswordValidation {
  /** Whether the password satisfies every rule. */
  isValid: boolean;
  /** Human-readable messages for each unmet rule; empty when `isValid` is `true`. */
  errors: string[];
  /** Coarse strength estimate derived from length and character variety. */
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * Checks a password against the shared complexity rules.
 *
 * @param password - Candidate password to evaluate.
 * @returns A {@link PasswordValidation} object; `isValid` is `true` only when every rule passes.
 */
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

/**
 * Updates the signed-in user's profile data.
 *
 * @param data - Fields to send to the profile endpoint (backend-defined keys, for example `name` or `phone_number`).
 * @returns The response body from the profile update endpoint.
 * @throws {@link AxiosError} When the request rejects.
 */
export const updateUserData = async (data: Record<string, unknown>) => {
  const response = await axiosInstance.put(API_ROUTES.USER.UPDATE_USER_DATA, data);
  return response.data;
};

/**
 * Changes the signed-in user's password.
 *
 * @param oldPassword - Current password, verified by the backend.
 * @param newPassword - Replacement password.
 * @returns The response body from the password-change endpoint.
 * @throws {@link AxiosError} When the request rejects, for example when the current password is wrong.
 */
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
