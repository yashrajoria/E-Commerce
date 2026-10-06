import axios from "axios";
import { getBackendBaseUrl } from "@ecommerce/shared";
import { getResponseInfo } from "@/lib/error";
import { NextApiRequest, NextApiResponse } from "next";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

export default withAdminApi(handler);
