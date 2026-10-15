import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

/** Identity fields the admin panel reads off the `/api/admin/auth/status` response. */
export type AdminSessionUser = {
  /** Identity-service user id. */
  id?: string;
  /** Login email address. */
  email?: string;
  /** Display name. */
  name?: string;
  /** Raw role string, lower-cased when extracted. */
  role?: string;
};

/** Session state exposed by {@link AdminSessionProvider} and consumed through {@link useAdminSession}. */
type AdminSession = {
  /** `true` while the session status request is in flight. */
  loading: boolean;
  /** `true` when the status response identified a user. */
  authenticated: boolean;
  /** `true` when the resolved role is exactly `admin`. */
  isAdmin: boolean;
  /** Resolved user, or `null` when unauthenticated. */
  user: AdminSessionUser | null;
  /** Re-runs the status check, refreshing tokens first when the access token expired. */
  refresh: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSession | null>(null);

function isAuthenticatedUser(user: AdminSessionUser | null): boolean {
  if (!user) return false;
  return Boolean(user.id || user.email);
}

function extractUser(payload: unknown): AdminSessionUser | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;

  const nested =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : null;

  const id =
    (typeof nested?.id === "string" && nested.id) ||
    (typeof data.id === "string" && data.id) ||
    (typeof data.user_id === "string" && data.user_id) ||
    undefined;
  const email =
    (typeof nested?.email === "string" && nested.email) ||
    (typeof data.email === "string" && data.email) ||
    undefined;
  const name =
    (typeof nested?.name === "string" && nested.name) ||
    (typeof data.name === "string" && data.name) ||
    undefined;
  const roleRaw =
    (typeof nested?.role === "string" && nested.role) ||
    (typeof data.role === "string" && data.role) ||
    (typeof data.user_role === "string" && data.user_role) ||
    "";

  if (!id && !email) return null;

  return {
    id,
    email,
    name,
    role: roleRaw ? roleRaw.toLowerCase() : undefined,
  };
}

/** Props accepted by {@link AdminSessionProvider}. */
interface AdminSessionProviderProps {
  /** The subtree that may call {@link useAdminSession}. */
  children: ReactNode;
}

/**
 * Provides the shared admin session (loading, authenticated, isAdmin, user, refresh) to the app.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router);
 * relies on client-side state/effects, so it runs in the browser after
 * hydration. Errors on background refreshes deliberately keep the last known
 * user so a single bad response does not hard-logout a still-valid admin.
 *
 * @example
 * ```tsx
 * // pages/_app.tsx
 * <AdminSessionProvider>
 *   <AppContent {...pageProps} />
 * </AdminSessionProvider>
 * ```
 */
export function AdminSessionProvider({ children }: AdminSessionProviderProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const hasLoadedOnce = useRef(false);

  const refresh = useCallback(async () => {
    // Avoid blanking the UI / re-tripping the auth gate on background refreshes.
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const res = await axios.get("/api/admin/auth/status", {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (res.status === 401 || res.status === 403) {
        // Access may have expired — try public refresh, then status again.
        try {
          await axios.post(
            "/api/admin/auth/refresh",
            {},
            { withCredentials: true },
          );
          const retry = await axios.get("/api/admin/auth/status", {
            withCredentials: true,
            validateStatus: (status) => status < 500,
          });
          if (retry.status >= 400) {
            setUser(null);
          } else {
            setUser(extractUser(retry.data));
          }
        } catch {
          setUser(null);
        }
      } else if (res.status >= 400) {
        // Keep prior session on unexpected 4xx so a single bad response
        // does not hard-logout a still-valid admin.
        if (!hasLoadedOnce.current) {
          setUser(null);
        }
      } else {
        setUser(extractUser(res.data));
      }
    } catch {
      // Network blip: keep last known user after first successful load.
      if (!hasLoadedOnce.current) {
        setUser(null);
      }
    } finally {
      hasLoadedOnce.current = true;
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

  return createElement(AdminSessionContext.Provider, { value }, children);
}

/**
 * Reads the shared admin session from context.
 *
 * @remarks
 * Backed by `/api/admin/auth/status` (gateway JWT → `/auth/status`). Prefer this
 * over the shared storefront `useAuth` for RBAC decisions.
 *
 * @returns The {@link AdminSession} object: `loading`, `authenticated`,
 * `isAdmin`, `user` and the `refresh` callback.
 * @throws {@link Error} When called outside {@link AdminSessionProvider}.
 */
export function useAdminSession(): AdminSession {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return ctx;
}
