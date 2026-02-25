import axios from "axios";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type PropsWithUser = { user?: unknown };

export async function requireAuth(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PropsWithUser>> {
  const cookie = ctx.req.headers.cookie || "";
  const base = process.env.NEXT_PUBLIC_NEW_API_URL;

  if (!base) {
    return {
      redirect: { destination: "/sign-in", permanent: false },
    };
  }

  try {
    const res = await axios.get(`${base}auth/status`, {
      headers: { Cookie: cookie },
      withCredentials: true,
      timeout: 5000,
    });

    // allow page, forward user data if present
    const data = res.data || null;
    return { props: { user: data } };
  } catch (e) {
    return {
      redirect: { destination: "/sign-in", permanent: false },
    };
  }
}
