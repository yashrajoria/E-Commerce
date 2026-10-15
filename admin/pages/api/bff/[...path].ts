import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

/** Only admin BFF surfaces may be reached through this catch-all. */
const ALLOWED_PREFIXES = [
  "admin/dashboard",
  "admin/products",
  "admin/categories",
  "admin/inventory",
  "admin/orders",
  "admin/users",
  "admin/customers",
  "admin/agent",
  "admin/promotions",
  "admin/coupons",
  "admin/notifications",
  "admin/reports",
  "admin/analytics",
  "admin/upload",
  "admin/stores",
  "admin/plans",
] as const;

function isAllowedBffPath(targetPath: string): boolean {
  if (!targetPath || targetPath.includes("..")) return false;
  const normalized = targetPath.replace(/^\/+/, "").replace(/\/+$/, "");
  return ALLOWED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParam = req.query.path;
  if (!pathParam) return res.status(400).json({ message: "Missing path" });

  const segments = Array.isArray(pathParam) ? pathParam : [pathParam];
  const targetPath = segments.join("/");

  if (!isAllowedBffPath(targetPath)) {
    return res.status(403).json({ message: "Forbidden BFF path" });
  }

  try {
    const response = await proxyRequest({
      req,
      targetPath: `/bff/${targetPath}`,
      sanitizeSetCookie: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("BFF proxy error:", err);
    return res.status(500).json({ message: "BFF proxy error" });
  }
}

/**
 * Catch-all proxy for admin BFF requests under `/api/bff/[...path]`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Only paths matching an entry in {@link ALLOWED_PREFIXES} are accepted (`403` otherwise), and any path containing
 * `..` is rejected. Accepted requests are forwarded to the backend as `/bff/{path}` through `proxyRequest`, with the
 * upstream headers copied back and `Set-Cookie` sanitized.
 *
 * @param req - The Next.js API request; `req.query.path` holds the catch-all segments appended to `/bff/`.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied status, headers, and body have been sent.
 */
export default withAdminApi(handler);
