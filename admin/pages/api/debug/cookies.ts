import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Local-only cookie debug helper. Disabled in production and unless explicitly enabled.
 * Set ENABLE_COOKIE_DEBUG=1 in development if you need to inspect cookies.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_COOKIE_DEBUG !== "1"
  ) {
    return res.status(404).json({ message: "Not found" });
  }

  const rawCookie = req.headers.cookie || "(none)";
  const parsed =
    rawCookie === "(none)"
      ? {}
      : Object.fromEntries(
          rawCookie.split(";").map((c) => {
            const [key, ...rest] = c.trim().split("=");
            return [key, rest.join("=")];
          }),
        );

  return res.status(200).json({
    keys: Object.keys(parsed),
    has__session: "__session" in parsed,
    hasToken: "token" in parsed,
  });
}
