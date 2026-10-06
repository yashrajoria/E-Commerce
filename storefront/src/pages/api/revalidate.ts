import type { NextApiRequest, NextApiResponse } from "next";

type RevalidateResponse = {
  revalidated?: boolean;
  path?: string;
  timestamp?: number;
  message?: string;
};

/**
 * On-Demand Incremental Static Regeneration (ISR) Revalidation Endpoint
 *
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body: { "path": "/products/123" }
 *
 * Or GET /api/revalidate?secret=YOUR_SECRET&path=/products/123
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>,
) {
  const secret = req.query.secret || req.headers["x-revalidate-secret"];
  const expectedSecret = process.env.REVALIDATE_SECRET;

  // In production, require configured REVALIDATE_SECRET
  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ message: "Invalid revalidation secret token" });
  }

  const path =
    (typeof req.query.path === "string" ? req.query.path : undefined) ||
    (req.body && typeof req.body.path === "string" ? req.body.path : undefined) ||
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
    const message = err instanceof Error ? err.message : "Error revalidating path";
    return res.status(500).json({ message, path });
  }
}
