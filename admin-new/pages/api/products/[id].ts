import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { backendUrl, getBackendBaseUrl } from "@/lib/backend";
import { NextApiRequest, NextApiResponse } from "next";

// Utility function to extract auth cookie (forward full cookie header)
const extractAuthCookie = (cookieHeader: string | undefined): string => {
  return cookieHeader || "";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  console.log("ID", id);
  const tokenCookie = extractAuthCookie(req.headers.cookie);
  const baseUrl = getBackendBaseUrl();

  if (!baseUrl) {
    console.error("API URL is not defined in environment variables");
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const axiosConfig = {
    headers: { Cookie: tokenCookie },
    withCredentials: true,
  };

  try {
    switch (req.method) {
      case "GET": {
        if (!id) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        console.log("Fetching product:", backendUrl(`products/${id}`));
        const response = await axios.get(
          backendUrl(`products/${id}`),
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "PUT": {
        if (!id) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        console.log("Updating product:", backendUrl(`products/${id}`));
        console.log(req.body);
        const response = await axios.put(
          backendUrl(`products/${id}`),
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "POST": {
        console.log("Creating new product:", backendUrl("products/"));
        const response = await axios.post(
          backendUrl("products/"),
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }
      case "DELETE": {
        console.log("Deleting product:", backendUrl(`products/${id}`));

        const response = await axios.delete(
          backendUrl(`products/${id}`),
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      default:
          res.setHeader("Allow", ["GET", "PUT", "POST", "DELETE"]);
          return res
            .status(405)
            .json({ message: `Method ${req.method} Not Allowed` });
      }
  } catch (err: unknown) {
    console.error("API error:", err);
    const { status, data } = getResponseInfo(err);
    const errorData = data ?? { message: "Internal Server Error" };
    return res.status(status || 500).json(errorData);
  }
}
