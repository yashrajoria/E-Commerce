import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

/** Route configuration — keeps the default body parser enabled so the JSON `items` payload arrives as `req.body`. */
export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const items = req.body?.items;
  if (!Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "Invalid payload: items array required" });
  }

  // Prefer backend bulk endpoint.
  try {
    const response = await proxyRequest({
      req: {
        method: "POST",
        url: req.url,
        headers: req.headers,
        body: { items },
      },
      targetPath: "/bff/admin/categories/bulk",
      sanitizeSetCookie: true,
    });

    if (response.status !== 404 && response.status !== 405) {
      for (const [header, value] of Object.entries(response.headers)) {
        res.setHeader(header, value);
      }
      return res.status(response.status).send(response.body);
    }
  } catch (err: unknown) {
    console.warn("Bulk categories endpoint unavailable, falling back:", err);
  }

  // Fall back to creating items one by one.
  const results: Array<{
    status: number;
    data?: unknown;
    error?: unknown;
  }> = [];

  for (const it of items) {
    try {
      const r = await proxyRequest({
        req: {
          method: "POST",
          url: "/api/categories",
          headers: req.headers,
          body: it,
        },
        targetPath: "/bff/admin/categories",
        sanitizeSetCookie: true,
      });

      let data: unknown = r.body;
      try {
        data = JSON.parse(r.body);
      } catch {
        // keep raw body
      }

      if (r.status >= 400) {
        results.push({ status: r.status, error: data });
      } else {
        results.push({ status: r.status, data });
      }
    } catch (e: unknown) {
      results.push({
        status: 500,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return res.status(207).json({ results });
}

/**
 * Bulk-creates categories at `POST /api/categories/bulk`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Requires a JSON body whose `items` field is an array. It first tries the backend bulk endpoint
 * `POST /bff/admin/categories/bulk`; if that answers `404`/`405` or throws, it falls back to creating each item
 * individually through `POST /bff/admin/categories`. The fallback answers `207` with a per-item `results` array of
 * status/data/error entries.
 *
 * @param req - The Next.js API request; `req.body.items` must be an array of category payloads.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied bulk response or the per-item fallback summary has been sent.
 */
export default withAdminApi(handler);
