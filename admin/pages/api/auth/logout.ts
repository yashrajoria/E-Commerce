import type { NextApiRequest, NextApiResponse } from "next";
import { proxyAuthAction } from "@/lib/proxyAuthAction";

/**
 * Handles any HTTP method on the legacy `/api/auth/logout` alias, proxying to the upstream `/auth/logout` route.
 *
 * @deprecated Prefer `/api/admin/auth/logout`.
 * @param req - The Next.js API request; cookies and body are forwarded upstream with any top-level `role` field stripped.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied response has been relayed.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return proxyAuthAction("logout", req, res);
}
