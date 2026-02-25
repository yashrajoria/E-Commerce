import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_NEW_API_URL;

/**
 * Sanitize backend Set-Cookie headers so they work when relayed from the
 * Next.js API proxy to the browser.
 *
 * Problems this solves:
 *  - Domain=<backend-host> → browser rejects cookie for frontend origin
 *  - Secure flag → browser rejects cookie over plain http://localhost
 *  - SameSite=None without Secure → browser rejects cookie
 *  - Path might be wrong or missing
 */
function sanitizeSetCookies(raw: string[]): string[] {
  const isProd = process.env.NODE_ENV === "production";

  return raw.map((cookie) => {
    let c = cookie;

    // 1. Remove Domain — let the browser default to the request origin
    c = c.replace(/;?\s*Domain=[^;]*/gi, "");

    if (!isProd) {
      // 2. Remove Secure (cannot set Secure cookies over http://localhost)
      c = c.replace(/;?\s*Secure/gi, "");

      // 3. If SameSite=None was present, downgrade to Lax (None requires Secure)
      c = c.replace(/SameSite=None/gi, "SameSite=Lax");
    }

    // 4. Ensure Path=/ so the cookie is sent on all routes
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
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const response = await axios.post(`${API_URL}auth/login`, req.body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "",
      },
      withCredentials: true,
    });

    const setCookie = response.headers["set-cookie"] as string[] | undefined;
    console.debug("[login proxy] Raw Set-Cookie from backend:", setCookie);

    if (setCookie && setCookie.length > 0) {
      const sanitized = sanitizeSetCookies(setCookie);
      console.debug("[login proxy] Sanitized Set-Cookie:", sanitized);
      res.setHeader("Set-Cookie", sanitized);
    } else {
      console.warn("[login proxy] No Set-Cookie header received from backend");
    }

    return res.status(response.status).json(response.data);
  } catch (err: any) {
    // If backend returned Set-Cookie even on error (e.g. 401), relay it
    const errSetCookie = err?.response?.headers?.["set-cookie"] as
      | string[]
      | undefined;
    if (errSetCookie && errSetCookie.length > 0) {
      res.setHeader("Set-Cookie", sanitizeSetCookies(errSetCookie));
    }

    console.error(
      "Auth proxy error (login):",
      err?.response?.data || err.message,
    );
    return res
      .status(err?.response?.status || 500)
      .json({ message: err?.response?.data || "Auth error" });
  }
}
