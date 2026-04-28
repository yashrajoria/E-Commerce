import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  checkStatus,
  getUserData,
} from '../api/auth';

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
  [key: string]: unknown;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Shared promise to deduplicate multiple status checks across component mounts
let profileInFlight: Promise<User> | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const register = useCallback(async (email: string, password: string, name?: string, role?: string) => {
    await apiRegister(email, password, name ?? '', role);
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default useAuth;
