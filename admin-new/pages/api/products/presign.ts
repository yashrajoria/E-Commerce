/* eslint-disable @typescript-eslint/no-explicit-any */

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
  } catch (err: unknown) {
    console.error("Presign proxy error:", err);
    const status =
      typeof err === "object" && err !== null && "response" in err
        ? (err as any).response?.status
        : 500;
    const message =
      typeof err === "object" && err !== null && "response" in err
        ? (err as any).response?.data
        : "Server error";
    return res.status(status || 500).json({ message });
  }
}
