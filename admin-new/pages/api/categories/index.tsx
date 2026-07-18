import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

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

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

export default withAdminApi(handler);
