import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

/** Route configuration — keeps the default body parser enabled so JSON bodies arrive as `req.body`. */
export const config = {
  api: {
    bodyParser: true,
  },
};

async function sendProxied(
  req: NextApiRequest,
  res: NextApiResponse,
  targetPath: string,
) {
  const response = await proxyRequest({
    req,
    targetPath,
    sanitizeSetCookie: true,
  });

  for (const [header, value] of Object.entries(response.headers)) {
    res.setHeader(header, value);
  }

  return res.status(response.status).send(response.body);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      return await sendProxied(req, res, "/bff/admin/categories");
    } catch (err: unknown) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ message: "Error fetching categories" });
    }
  }

  if (req.method === "POST") {
    try {
      return await sendProxied(req, res, "/bff/admin/categories");
    } catch (err: unknown) {
      console.error("Error creating category:", err);
      return res.status(500).json({ message: "Error creating category" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

/**
 * Lists and creates categories at `/api/categories`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * `GET` proxies `GET /bff/admin/categories` and `POST` proxies `POST /bff/admin/categories`, copying the upstream
 * status, headers, and body; any other method receives `405`.
 *
 * @param req - The Next.js API request; for `POST` the JSON body is forwarded to the backend unchanged.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied category payload has been sent.
 */
export default withAdminApi(handler);
