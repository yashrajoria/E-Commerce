import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/** Route configuration allowing up to 60 seconds for the catalog proxy, which may wait on an idle backend instance waking up. */
export const config = {
  maxDuration: 60,
};

/**
 * Handles all HTTP methods on `/api/user/categories/[[...path]]` — a public read proxy to the backend `/categories/*`.
 *
 * @remarks
 * No auth cookie is required. A 45-second proxy timeout is used because the catalog service can take 20–30 seconds to wake from idle on Render; upstream timeouts surface as a `504` from {@link proxyRequest}, and any other proxy failure returns `500`.
 *
 * @param req - The Next.js API request; the catch-all `path` segments are appended to `/categories` and the query string is forwarded.
 * @param res - The Next.js API response; mirrors the proxied status, headers and body.
 * @returns A promise that resolves once the response has been sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const categoryPath = segments.length > 0 ? `/${segments.join("/")}` : "";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/categories${categoryPath}`,
      // Render can take 20-30 seconds to wake the catalog service from idle.
      timeoutMs: 45_000,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(
      `[user categories proxy] ${categoryPath || "/"} failed`,
      error,
    );
    return res.status(500).json({ error: "Internal server error" });
  }
}
