import {
  getUserData as sharedGetUserData,
  // updateUserData not present in shared API; keep a thin wrapper using axios if needed
  updateUserData as sharedUpdateUserData,
  // updatePassword is not exposed as the same name in shared; use shared API if available
  // For parity, map to shared endpoint names where appropriate
} from "@ecommerce/shared";
import { axiosInstance } from "@/utils/axiosInstance";
import { API_ROUTES } from "../pages/api/constants/apiRoutes";

type AuthStatus = { authenticated: boolean } & Record<string, unknown>;

let authStatusInFlight: Promise<AuthStatus> | null = null;
let authStatusCache: { value: AuthStatus; expiresAt: number } | null = null;

/**
 * Fetches the authenticated user's profile via the shared auth client.
 *
 * @returns A promise resolving to the profile payload from the user profile endpoint.
 * @throws {@link Error} When the profile request fails (including 401 responses).
 */
export const getUserData = async () => sharedGetUserData();

/**
 * Persists profile changes through the shared client, falling back to the
 * app's axios instance when the shared updater is unavailable.
 *
 * @param data - Partial profile fields to persist.
 * @returns A promise resolving to the updated profile payload.
 * @throws {@link Error} When both the shared and fallback update calls fail.
 */
export const updateUserData = async (data: Record<string, unknown>) => {
  if (typeof sharedUpdateUserData === "function") {
    return sharedUpdateUserData(data);
  }
  // Fallback: call the app's existing axios instance to update profile
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.put(
    API_ROUTES.USER.UPDATE_USER_DATA,
    data,
  );
  return response.data;
};

/**
 * Changes the account password, preferring the shared client and falling
 * back to a direct POST to the user password endpoint.
 *
 * @param oldPassword - Current password for verification.
 * @param newPassword - Replacement password.
 * @returns A promise resolving to the update payload.
 * @throws {@link Error} When both the shared and fallback password-change calls fail.
 */
export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  // Try to call shared API if available
  try {
    const shared = await import("@ecommerce/shared");
    if (typeof shared.updatePassword === "function") {
      return await shared.updatePassword(oldPassword, newPassword);
    }
  } catch {
    // ignore
  }

  // Fallback to local axios
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.post(API_ROUTES.USER.UPDATE_PASSWORD, {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

/**
 * Signs the user out, preferring the shared logout helper and falling back
 * to a direct POST to the auth logout endpoint.
 *
 * @returns A promise resolving to the logout payload.
 * @throws {@link Error} When both the shared and fallback logout calls fail.
 */
export const logoutUser = async () => {
  try {
    const shared = await import("@ecommerce/shared");
    if (typeof shared.logout === "function") {
      return await shared.logout();
    }
  } catch {
    // ignore
  }
  const { axiosInstance } = await import("@/utils/axiosInstance");
  const { API_ROUTES } = await import("../pages/api/constants/apiRoutes");
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  return response.data;
};

/**
 * Reports whether the current visitor is authenticated.
 *
 * @remarks
 * Deduplicates concurrent status calls and caches the result for five seconds;
 * after a failed call it caches `{ authenticated: false }` for two seconds. A
 * 429 response reuses the last known cached value instead of forcing `false`.
 *
 * @returns A promise resolving to the cached or freshly fetched auth status payload
 * (`{ authenticated: boolean }`), never rejecting.
 */
export const checkAuthStatus = async () => {
  const now = Date.now();
  if (authStatusCache && authStatusCache.expiresAt > now) {
    return authStatusCache.value;
  }

  if (authStatusInFlight) {
    return authStatusInFlight;
  }

  authStatusInFlight = (async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.AUTH.STATUS);
      const payload = response.data as AuthStatus;
      authStatusCache = {
        value: payload,
        expiresAt: Date.now() + 5000,
      };
      return payload;
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      // If rate-limited, prefer the last known auth state instead of forcing false.
      if (status === 429 && authStatusCache?.value) {
        return authStatusCache.value;
      }

      // Treat any error (including 401) as not authenticated
      // Don't trigger logout event; let interceptor handle it on subsequent requests
      const fallback = { authenticated: false } as AuthStatus;
      authStatusCache = {
        value: fallback,
        expiresAt: Date.now() + 2000,
      };
      return fallback;
    } finally {
      authStatusInFlight = null;
    }
  })();

  try {
    return await authStatusInFlight;
  } catch {
    return { authenticated: false } as AuthStatus;
  }
};
