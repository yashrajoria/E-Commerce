import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  checkStatus,
  getUserData,
} from '../api/auth';

/**
 * Authenticated user shape exposed by {@link AuthProvider} and {@link useAuth}.
 *
 * @remarks
 * `null` represents a signed-out visitor. Extra keys are permitted so
 * backend-specific fields do not break consumers.
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
  [key: string]: unknown;
} | null;

/** Shape of the context value produced by {@link AuthProvider} and returned by {@link useAuth}. */
type AuthContextType = {
  /** The signed-in user, or `null` when signed out. */
  user: User;
  /** `true` while the initial profile check or a refetch is in flight. */
  loading: boolean;
  /** Convenience flag derived from `user` — `true` whenever a user is present. */
  authenticated: boolean;
  /**
   * Signs in through the shared auth API and refreshes the cached profile.
   *
   * @param email - Account email address.
   * @param password - Account password.
   */
  login: (email: string, password: string) => Promise<void>;
  /**
   * Registers a new account and refreshes the cached profile.
   *
   * @param email - Account email address.
   * @param password - Account password.
   * @param name - Optional display name.
   */
  register: (email: string, password: string, name?: string) => Promise<void>;
  /** Ends the session; the cached user is cleared even when the API call fails. */
  logout: () => Promise<void>;
  /** Re-fetches the profile from the backend, toggling `loading` around the request. */
  refetchUser: () => Promise<void>;
};

/** React context carrying the auth state; `undefined` until a provider supplies a value. */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Shared promise to deduplicate multiple status checks across component mounts
let profileInFlight: Promise<User> | null = null;

/** Props accepted by {@link AuthProvider}. */
interface AuthProviderProps {
  /** Subtree that can call {@link useAuth} to read and update the auth state. */
  children: React.ReactNode;
}

/**
 * Provides auth state and actions to a React subtree.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Checks the session once on mount (deduplicating concurrent checks) and clears the cached user whenever a `logout` window event fires.
 *
 * @example
 * ```tsx
 * // Wrap the app once so descendants can call `useAuth()`.
 * <AuthProvider>
 *   <StorefrontApp />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileOnce = useCallback(async (): Promise<User> => {
    if (!profileInFlight) {
      profileInFlight = (async () => {
        try {
          const status = await checkStatus();
          if (status?.authenticated) {
            return await getUserData();
          }
          return null;
        } catch (err) {
          console.error('[shared/useAuth] fetchProfileOnce error', err);
          return null;
        } finally {
          profileInFlight = null;
        }
      })();
    }
    return profileInFlight;
  }, []);

  const refetchUser = useCallback(async () => {
    setLoading(true);
    const ud = await fetchProfileOnce();
    setUser(ud);
    setLoading(false);
  }, [fetchProfileOnce]);

  useEffect(() => {
    void refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('logout', onLogout);
    return () => window.removeEventListener('logout', onLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await apiLogin(email, password);
    await refetchUser();
  }, [refetchUser]);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await apiRegister(email, password, name ?? '');
    await refetchUser();
  }, [refetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('[shared/useAuth] logout error', err);
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    authenticated: !!user,
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Reads the shared auth state from the nearest {@link AuthProvider}.
 *
 * @remarks
 * Exposes the cached user plus the login, register, logout and refetch actions provided by {@link AuthProvider}.
 *
 * @returns The {@link AuthContextType} value: `user`, `loading`, `authenticated`, `login`, `register`, `logout` and `refetchUser`.
 * @throws {@link Error} When called outside an {@link AuthProvider}.
 * @example
 * ```tsx
 * const { user, authenticated, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default useAuth;
