/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const response = await axios.post(
      `${API_URL}auth/refresh`,
      req.body || {},
      {
        headers: { Cookie: req.headers.cookie || "" },
        withCredentials: true,
      },
    );

    const setCookie = response.headers["set-cookie"] as string[] | undefined;
    if (setCookie && setCookie.length)
      res.setHeader(
        "Set-Cookie",
        setCookie.map((c) => c.replace(/;?\s*Domain=[^;]*/gi, "")),
      );

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Auth refresh proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Refresh error" });
  }
}
