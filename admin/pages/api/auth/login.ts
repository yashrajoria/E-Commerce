import type { NextApiRequest, NextApiResponse } from "next";
import { proxyAuthAction } from "@/lib/proxyAuthAction";

/**
 * Handles `POST` requests on the legacy `/api/auth/login` alias, proxying to the upstream `/auth/login` route.
 *
 * @deprecated Prefer `/api/admin/auth/login`.
 * @param req - The Next.js API request; the credentials body is forwarded upstream with any top-level `role` field stripped.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied response has been relayed.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  return proxyAuthAction("login", req, res);
}
