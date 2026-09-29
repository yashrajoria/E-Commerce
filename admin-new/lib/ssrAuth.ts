import axios from "axios";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { backendUrl, getBackendBaseUrl } from "@/lib/backend";

type PropsWithUser = { user?: unknown };

export async function requireAuth(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PropsWithUser>> {
  const cookie = ctx.req.headers.cookie || "";
  const base = getBackendBaseUrl();

  if (!base) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  try {
    const res = await axios.get(backendUrl("auth/status"), {
      headers: { Cookie: cookie },
      withCredentials: true,
      timeout: 5000,
    });

    // allow page, forward user data if present. Enforce admin role.
    const data = res.data || null;
    const payload =
      data && typeof data === "object" && "user" in (data as Record<string, unknown>)
        ? (data as Record<string, unknown>).user
        : data;
    const role =
      payload && typeof payload === "object"
        ? String((payload as Record<string, unknown>).role ?? "")
        : "";
    if (role && role !== "admin") {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }
    return { props: { user: data } };
  } catch (e) {
    console.error("SSR auth check failed:", e);
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
}
