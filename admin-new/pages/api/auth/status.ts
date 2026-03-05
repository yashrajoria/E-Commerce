/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

function sanitizeSetCookies(raw: string[]): string[] {
  const isProd = process.env.NODE_ENV === "production";

  return raw.map((cookie) => {
    let c = cookie;
    c = c.replace(/;?\s*Domain=[^;]*/gi, "");
    if (!isProd) {
      c = c.replace(/;?\s*Secure/gi, "");
      c = c.replace(/SameSite=None/gi, "SameSite=Lax");
    }
    if (!/Path=/i.test(c)) {
      c += "; Path=/";
    }
    return c;
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const response = await axios.get(`${API_URL}auth/status`, {
      headers: { Cookie: req.headers.cookie || "" },
      withCredentials: true,
    });

    const setCookie = response.headers["set-cookie"] as string[] | undefined;
    if (setCookie && setCookie.length > 0) {
      res.setHeader("Set-Cookie", sanitizeSetCookies(setCookie));
    }

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    const { headers, status, data } = getResponseInfo(err);
    const errSetCookie =
      typeof headers === "object" && headers !== null && "set-cookie" in (headers as { [k: string]: unknown })
        ? (headers as { [k: string]: unknown })["set-cookie"] as string[] | undefined
        : undefined;
    if (errSetCookie && errSetCookie.length > 0) {
      res.setHeader("Set-Cookie", sanitizeSetCookies(errSetCookie));
    }

    console.error("Auth proxy error (status):", err);
    return res.status(status || 500).json({ message: data ?? "Auth status error" });
  }
}
