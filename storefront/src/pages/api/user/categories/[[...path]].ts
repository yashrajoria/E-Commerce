import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export const config = {
  maxDuration: 60,
};

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
