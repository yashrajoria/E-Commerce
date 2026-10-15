import type { NextApiRequest, NextApiResponse } from "next";

/** Response body shape of the revalidation route. */
type RevalidateResponse = {
  revalidated?: boolean;
  path?: string;
  timestamp?: number;
  message?: string;
};

/**
 * Handles `GET` and `POST` on `/api/revalidate` — on-demand ISR endpoint that flushes one storefront path.
 *
 * @remarks
 * On-Demand Incremental Static Regeneration (ISR) endpoint. Usage: `POST /api/revalidate?secret=YOUR_SECRET` with a JSON body `{ "path": "/products/123" }`, or `GET /api/revalidate?secret=YOUR_SECRET&path=/products/123`. The secret may also arrive in the `x-revalidate-secret` header. When `REVALIDATE_SECRET` is configured, a mismatched secret is rejected with `401`; the path must start with `/` or a `400` is returned.
 *
 * @param req - The Next.js API request; reads the `secret`, the path (query string or JSON body) and the request method.
 * @param res - The Next.js API response; `res.revalidate(path)` performs the cache flush and the result is reported as JSON.
 * @returns A promise that resolves once the revalidation result or error has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>,
) {
  const secret = req.query.secret || req.headers["x-revalidate-secret"];
  const expectedSecret = process.env.REVALIDATE_SECRET;

  // In production, require configured REVALIDATE_SECRET
  if (expectedSecret && secret !== expectedSecret) {
    return res
      .status(401)
      .json({ message: "Invalid revalidation secret token" });
  }

  const path =
    (typeof req.query.path === "string" ? req.query.path : undefined) ||
    (req.body && typeof req.body.path === "string"
      ? req.body.path
      : undefined) ||
    "/";

  // Prevent path traversal or invalid schemes
  if (!path.startsWith("/")) {
    return res.status(400).json({ message: "Path must start with '/'" });
  }

  try {
    // Revalidate the specified route on Vercel's global CDN cache
    await res.revalidate(path);

    return res.status(200).json({
      revalidated: true,
      path,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error revalidating path";
    return res.status(500).json({ message, path });
  }
}
