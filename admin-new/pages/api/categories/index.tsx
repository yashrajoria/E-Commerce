import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { getResponseInfo } from "@/lib/error";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const API_URL =
    process.env.NEXT_PUBLIC_NEW_API_URL || "http://172.16.14.242:8080";

  if (req.method === "GET") {
    try {
      const cookieHeader = req.headers.cookie;
      const cookie = cookieHeader
        ? cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("__session=") || c.startsWith("token="))
        : undefined;
      const response = await axios.get(`${API_URL}categories/`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie || "",
        },
        withCredentials: true,
      });
      return res.status(response.status).json(response.data);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    try {
      const cookieHeader = req.headers.cookie;
      const cookie = cookieHeader
        ? cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("__session=") || c.startsWith("token="))
        : undefined;
      // POST new category to backend
      const target = `${API_URL}categories/`;
      console.debug("[categories proxy] POST ->", target, "body=", req.body);

      const response = await axios.post(target, req.body, {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie || "",
        },
        withCredentials: true,
      });
      return res.status(response.status).json(response.data);
    } catch (err: unknown) {
      console.error("Error creating category:", err);
      const { status, data } = getResponseInfo(err);
      return res
        .status(status || 500)
        .json(data ?? { message: "Error creating category" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
