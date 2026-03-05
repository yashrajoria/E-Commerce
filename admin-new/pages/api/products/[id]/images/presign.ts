import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  try {
    const cookie = req.headers.cookie || "";
    const body = req.body || {};

    const response = await axios.post(
      `${API_URL}products/${id}/images/presign`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Image presign proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Server error" });
  }
}
