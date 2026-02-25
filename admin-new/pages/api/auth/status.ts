import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
  } catch (err: any) {
    const errSetCookie = err?.response?.headers?.["set-cookie"] as
      | string[]
      | undefined;
    if (errSetCookie && errSetCookie.length > 0) {
      res.setHeader("Set-Cookie", sanitizeSetCookies(errSetCookie));
    }

    console.error(
      "Auth proxy error (status):",
      err?.response?.data || err.message,
    );
    return res
      .status(err?.response?.status || 500)
      .json({ message: err?.response?.data || "Auth status error" });
  }
}
