import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Utility function to extract token from cookies
const extractTokenFromCookies = (cookieHeader: string | undefined): string => {
  if (!cookieHeader) return "";
  const tokenCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.trim();
  return tokenCookie || "";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  console.log("ID", id);
  const tokenCookie = extractTokenFromCookies(req.headers.cookie);
  const baseUrl = process.env.NEXT_PUBLIC_NEW_API_URL;

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

        console.log("Fetching product:", `${baseUrl}products/${id}`);
        const response = await axios.get(
          `${baseUrl}products/${id}`,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "PUT": {
        if (!id) {
          return res.status(400).json({ message: "Product ID is required" });
        }

        console.log("Updating product:", `${baseUrl}products/${id}`);
        console.log(req.body);
        const response = await axios.put(
          `${baseUrl}products/${id}`,
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }

      case "POST": {
        console.log("Creating new product:", `${baseUrl}products/`);
        const response = await axios.post(
          `${baseUrl}products/`,
          req.body,
          axiosConfig,
        );
        return res.status(response.status).json(response.data);
      }
      case "DELETE": {
        console.log("Deleting product:", `${baseUrl}products/${id}`);

        const response = await axios.delete(
          `${baseUrl}products/${id}`,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API error:", err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    const errorData = err?.response?.data || {
      message: "Internal Server Error",
    };
    return res.status(status).json(errorData);
  }
}
