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
  return "";
}

/** SSR guard: authenticated + role=admin */
export async function requireAdmin(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PropsWithUser>> {
  const cookie = ctx.req.headers.cookie || "";
  const base = `${getBackendBaseUrl()}/`;

  try {
    const res = await axios.get(`${base}auth/status`, {
      headers: { Cookie: cookie },
      withCredentials: true,
      timeout: 5000,
    });

    const role = extractRole(res.data);
    if (role !== "admin") {
      return { redirect: { destination: "/?error=admin_required", permanent: false } };
    }

    const user =
      res.data?.user && typeof res.data.user === "object"
        ? (res.data.user as AdminUser)
        : null;
    return { props: { user } };
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
