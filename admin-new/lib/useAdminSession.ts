import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

export type AdminSessionUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AdminSession = {
  loading: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  user: AdminSessionUser | null;
  refresh: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSession | null>(null);

function isAuthenticatedUser(user: AdminSessionUser | null): boolean {
  if (!user) return false;
  return Boolean(user.id || user.email);
}

/**
 * Shared admin session for the whole app (login + _app gate must use the same state).
 */
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminSessionUser | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/auth/status", {
        withCredentials: true,
      });
      const u = (res.data?.user ?? null) as AdminSessionUser | null;
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const role = (user?.role || "").toLowerCase();
  const value = useMemo<AdminSession>(
    () => ({
      loading,
      authenticated: isAuthenticatedUser(user),
      isAdmin: role === "admin",
      user,
      refresh,
    }),
    [loading, user, role, refresh],
  );

  return createElement(
    AdminSessionContext.Provider,
    { value },
    children,
  );
}

/**
 * Admin-app session based on /api/admin/auth/status (gateway JWT → /auth/status).
 * Prefer this over shared storefront useAuth for RBAC.
 */
export function useAdminSession(): AdminSession {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return ctx;
}
