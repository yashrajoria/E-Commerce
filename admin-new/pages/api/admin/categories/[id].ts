import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  if (!["PUT", "DELETE"].includes(req.method || "")) {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const response = await proxyRequest({
      req,
      targetPath: `/categories/${id}`,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (error) {
    console.error(`[admin categories proxy] ${id} failed`, error);
    return res.status(500).json({ message: "Category proxy error" });
  }
}
