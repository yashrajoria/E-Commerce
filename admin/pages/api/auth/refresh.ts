import type { NextApiRequest, NextApiResponse } from "next";
import { proxyAuthAction } from "@/lib/proxyAuthAction";

/**
 * Handles any HTTP method on the legacy `/api/auth/refresh` alias, proxying to the upstream BFF route `/bff/auth/refresh`.
 *
 * @remarks
 * The BFF route is used instead of `/auth/refresh` because the gateway mounts the latter behind JWT middleware, which rejects expired access tokens; BFF refresh only needs the `refresh_token` cookie.
 *
 * @deprecated Prefer `/api/admin/auth/refresh`.
 * @param req - The Next.js API request; refresh cookies are forwarded upstream.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied response has been relayed.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return proxyAuthAction("refresh", req, res);
}
