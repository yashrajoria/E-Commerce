import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const productPath = segments.length > 0 ? `/${segments.join("/")}` : "";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/products${productPath}`,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user products proxy] ${productPath || "/"} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
