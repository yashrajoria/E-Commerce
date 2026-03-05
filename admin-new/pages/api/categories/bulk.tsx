/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

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
    process.env.NEXT_PUBLIC_NEW_API_URL || "http://localhost:8080/";

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookieHeader = req.headers.cookie;
  const cookie = cookieHeader
    ? cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("__session=") || c.startsWith("token="))
    : undefined;

  const items = req.body?.items;
  if (!Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "Invalid payload: items array required" });
  }

  // Try backend bulk endpoint first
  try {
    const target = `${API_URL}categories/bulk`;
    const resp = await axios.post(
      target,
      { items },
      {
        headers: { "Content-Type": "application/json", Cookie: cookie || "" },
        withCredentials: true,
      },
    );
    return res.status(resp.status).json(resp.data);
  } catch (err: unknown) {
    // If bulk endpoint not available, fall back to creating items one by one
    const respStatus =
      typeof err === "object" && err !== null && "response" in err
        ? (err as any).response?.status
        : undefined;
    if (respStatus === 404 || respStatus === 405) {
      const results: Array<{ status: number; data?: any; error?: any }> = [];
      for (const it of items) {
        try {
          const r = await axios.post(`${API_URL}categories/`, it, {
            headers: {
              "Content-Type": "application/json",
              Cookie: cookie || "",
            },
            withCredentials: true,
          });
          results.push({ status: r.status, data: r.data });
        } catch (e: unknown) {
          const s =
            typeof e === "object" && e !== null && "response" in e
              ? (e as any).response?.status || 500
              : 500;
          const errData =
            typeof e === "object" && e !== null && "response" in e
              ? (e as any).response?.data
              : (e instanceof Error ? e.message : String(e));
          results.push({ status: s, error: errData });
        }
      }
      return res.status(207).json({ results });
    }

    const status =
      typeof err === "object" && err !== null && "response" in err
        ? (err as any).response?.status
        : 500;
    const data =
      typeof err === "object" && err !== null && "response" in err
        ? (err as any).response?.data
        : { message: "Bulk upload failed" };
    return res.status(status).json(data);
  }
}
