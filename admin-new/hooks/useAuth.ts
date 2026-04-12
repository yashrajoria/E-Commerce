import { useEffect, useState, useCallback } from "react";
import axios from "axios";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
};

type User = AuthUser | null;

type ProfileResult = {
  status: number;
  authenticated: boolean;
  data: AuthUser | null;
};

let profileInFlight: Promise<ProfileResult> | null = null;

const normalizeProfile = (raw: unknown): AuthUser | null => {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;
  const dataPayload =
    obj.data && typeof obj.data === "object"
      ? (obj.data as Record<string, unknown>)
      : obj;
  const payload =
    dataPayload.user && typeof dataPayload.user === "object"
      ? (dataPayload.user as Record<string, unknown>)
      : dataPayload;

  const id = String(payload.id ?? payload._id ?? "").trim();
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const role = String(payload.role ?? "").trim();
  const phoneRaw = payload.phone ?? payload.phone_number;
  const phone =
    typeof phoneRaw === "string" && phoneRaw.trim().length > 0
      ? phoneRaw.trim()
      : undefined;

  if (!id || !name || !email || !role) {
    return null;
  }

  return { id, name, email, role, phone };
};

const fetchProfileOnce = async (): Promise<ProfileResult> => {
  if (!profileInFlight) {
    profileInFlight = axios
      .get("/api/auth/status", { withCredentials: true, timeout: 6000 })
      .then((res) => ({
        status: res.status,
        authenticated: Boolean(
          (res.data as Record<string, unknown> | null)?.authenticated ??
            (res.data as Record<string, unknown> | null)?.isAuthenticated ??
            normalizeProfile(res.data),
        ),
        data: normalizeProfile(res.data),
      }))
      .finally(() => {
        profileInFlight = null;
      });
  }

  return profileInFlight;
};

export default function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProfileOnce();

      if (res.status === 200 && res.authenticated) {
        setUser(res.data);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch {
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { user, loading, authenticated, refresh: fetchStatus } as const;
}
