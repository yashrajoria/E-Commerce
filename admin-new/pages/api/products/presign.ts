import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sku = (req.query.sku as string) || undefined;
    const cookie = req.headers.cookie || "";

    const url = sku
      ? `${API_URL}products/presign?sku=${encodeURIComponent(sku)}`
      : `${API_URL}products/presign`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("Presign proxy error:", err?.response?.data || err?.message);
    return res
      .status(err?.response?.status || 500)
      .json({ message: err?.response?.data || "Server error" });
  }
}
