import axios from "axios";
import { getBackendBaseUrl } from "@ecommerce/shared";
import { getResponseInfo } from "@/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const cookie = req.headers.cookie || "";
  const baseUrl = `${getBackendBaseUrl()}/`;

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    withCredentials: true,
  };

  try {
    switch (req.method) {
      case "GET": {
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        const response = await axios.get(
          `${baseUrl}bff/admin/products/${id}`,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "PUT": {
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        const response = await axios.put(
          `${baseUrl}bff/admin/products/${id}`,
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "POST": {
        const response = await axios.post(
          `${baseUrl}bff/admin/products`,
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "DELETE": {
        if (!id || Array.isArray(id)) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        const response = await axios.delete(
          `${baseUrl}bff/admin/products/${id}`,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err: unknown) {
    console.error("Product proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res
      .status(status || 500)
      .json(data ?? { message: "Product proxy error" });
  }
}

/**
 * Proxies product detail operations for `/api/products/[id]`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * `GET`, `PUT`, and `DELETE` require `req.query.id` and target `bff/admin/products/{id}`; `POST` creates a product
 * through `bff/admin/products` without sending the route `id`, so creation is also reachable at this path. Any other
 * method receives `405`, and upstream failures are mapped through `getResponseInfo`.
 *
 * @param req - The Next.js API request; `PUT` and `POST` bodies are forwarded to the backend as JSON.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the proxied product payload has been sent.
 */
export default withAdminApi(handler);
