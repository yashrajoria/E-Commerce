import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const path = req.query.path;
  const segments = Array.isArray(path) ? path : path ? [path] : [];
  const profilePath = segments.length > 0 ? `/${segments.join("/")}` : "/profile";

  try {
    const proxied = await proxyRequest({
      req,
      targetPath: `/users${profilePath}`,
    });

    for (const [header, value] of Object.entries(proxied.headers)) {
      res.setHeader(header, value);
    }

    return res.status(proxied.status).send(proxied.body);
  } catch (error) {
    console.error(`[user profile proxy] ${profilePath} failed`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
