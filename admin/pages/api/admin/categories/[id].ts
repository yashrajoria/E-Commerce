import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  if (!["PUT", "DELETE"].includes(req.method || "")) {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const response = await proxyRequest({
      req,
      targetPath: `/bff/admin/categories/${id}`,
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

/**
 * Handles `PUT` and `DELETE` requests for a single admin category, proxying to the upstream `/bff/admin/categories/{id}` route.
 *
 * @remarks
 * Wrapped with {@link withAdminApi}: requests must pass a same-origin check and carry a valid admin session. A missing or repeated `id` query parameter returns `400`; any other method returns `405` with an `Allow: PUT, DELETE` header.
 *
 * @param req - The Next.js API request; `req.query.id` selects the category and is appended to the upstream path.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the upstream response has been relayed.
 */
export default withAdminApi(handler);
