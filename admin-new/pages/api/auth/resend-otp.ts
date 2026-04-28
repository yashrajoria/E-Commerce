import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  console.debug("[resend-otp] incoming", { body: sanitizeForLog(req.body), cookiePresent: !!req.headers.cookie });
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}auth/resend-otp`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      },
    );

    console.debug("[resend-otp] backend response", { status: response.status });
    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("[resend-otp] initial proxy error:", err);
    // Try a fallback endpoint if backend uses a different path
    try {
      console.debug("[resend-otp] attempting fallback endpoint auth/resend");
      const fallback = await axios.post(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}auth/resend`,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie || "",
          },
          withCredentials: true,
        },
      );
      console.debug("[resend-otp] fallback response", { status: fallback.status });
      return res.status(fallback.status).json(fallback.data);
    } catch (err2: unknown) {
      console.error("[resend-otp] fallback proxy error:", err2);
      const { status, data } = getResponseInfo(err2);
      return res.status(status || 500).json({ message: data ?? "Resend OTP failed" });
    }
  }
}

// small helper to avoid logging raw sensitive fields
function sanitizeForLog(body: unknown) {
  if (!body || typeof body !== "object") return body;
  try {
    const copy = { ...(body as Record<string, unknown>) };
    if ("password" in copy) copy.password = "***REDACTED***";
    if ("code" in copy) copy.code = "***REDACTED***";
    return copy;
  } catch {
    return "<unserializable>";
  }
}
