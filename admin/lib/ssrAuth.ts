import axios from "axios";
import { getBackendBaseUrl } from "@ecommerce/shared";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type AdminUser = {
  id?: string;
  email?: string;
  role?: string;
};

type PropsWithUser = { user?: AdminUser | null };

function extractRole(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as Record<string, unknown>;
  const user = data.user;
  if (user && typeof user === "object") {
    const role = (user as Record<string, unknown>).role;
    if (typeof role === "string") return role.toLowerCase();
  }
  if (typeof data.role === "string") return data.role.toLowerCase();
  if (typeof data.user_role === "string") return data.user_role.toLowerCase();
  return "";
}

function extractUser(payload: unknown): AdminUser | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const nested =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : null;

  const id =
    (typeof nested?.id === "string" && nested.id) ||
    (typeof data.id === "string" && data.id) ||
    undefined;
  const email =
    (typeof nested?.email === "string" && nested.email) ||
    (typeof data.email === "string" && data.email) ||
    undefined;
  const role = extractRole(payload) || undefined;

  if (!id && !email) return null;
  return { id, email, role };
}

function mergeSetCookieIntoJar(
  existingCookie: string,
  setCookieHeader: string | string[] | undefined,
): string {
  if (!setCookieHeader) return existingCookie;

  const parts = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];
  const jar = new Map<string, string>();

  for (const pair of existingCookie.split(";")) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    jar.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }

  for (const raw of parts) {
    const first = raw.split(";")[0]?.trim();
    if (!first) continue;
    const eq = first.indexOf("=");
    if (eq === -1) continue;
    jar.set(first.slice(0, eq), first.slice(eq + 1));
  }

  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function forwardSetCookies(
  ctx: GetServerSidePropsContext,
  setCookieHeader: string | string[] | undefined,
) {
  if (!setCookieHeader || !ctx.res) return;
  ctx.res.setHeader("Set-Cookie", setCookieHeader);
}

/** SSR guard: authenticated + role=admin */
export async function requireAdmin(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PropsWithUser>> {
  let cookie = ctx.req.headers.cookie || "";
  const base = `${getBackendBaseUrl()}/`;

  const fetchStatus = async (cookieHeader: string) =>
    axios.get(`${base}auth/status`, {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
      timeout: 5000,
      validateStatus: () => true,
    });

  try {
    let res = await fetchStatus(cookie);

    // Access JWT may be expired (15m) while refresh_token is still valid.
    if (res.status === 401 || res.status === 403) {
      const refreshRes = await axios.post(
        `${base}bff/auth/refresh`,
        {},
        {
          headers: {
            Cookie: cookie,
            "Content-Type": "application/json",
          },
          timeout: 5000,
          validateStatus: () => true,
        },
      );

      const setCookie = refreshRes.headers["set-cookie"];
      forwardSetCookies(ctx, setCookie);
      cookie = mergeSetCookieIntoJar(cookie, setCookie);

      if (refreshRes.status >= 400) {
        return { redirect: { destination: "/", permanent: false } };
      }

      res = await fetchStatus(cookie);
    }

    if (res.status >= 400) {
      return { redirect: { destination: "/", permanent: false } };
    }

    const role = extractRole(res.data);
    if (role !== "admin") {
      return {
        redirect: { destination: "/?error=admin_required", permanent: false },
      };
    }

    return { props: { user: extractUser(res.data) } };
  } catch (e) {
    console.error("SSR admin auth check failed:", e);
    return { redirect: { destination: "/", permanent: false } };
  }
}

/** @deprecated use requireAdmin */
export async function requireAuth(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PropsWithUser>> {
  return requireAdmin(ctx);
}
