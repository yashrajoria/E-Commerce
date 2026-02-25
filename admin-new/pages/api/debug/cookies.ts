import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Debug endpoint – returns the cookies the browser is sending to the Next.js server.
 * Visit /api/debug/cookies in the browser (or curl) after login to verify cookies are present.
 *
 * ⚠️  Remove or protect this endpoint before deploying to production.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawCookie = req.headers.cookie || "(none)";

  // Parse into key-value pairs for readability
  const parsed =
    rawCookie === "(none)"
      ? {}
      : Object.fromEntries(
          rawCookie.split(";").map((c) => {
            const [key, ...rest] = c.trim().split("=");
            return [key, rest.join("=")];
          }),
        );

  console.debug("[debug/cookies] Incoming cookies:", rawCookie);

  return res.status(200).json({
    raw: rawCookie,
    parsed,
    has__session: "__session" in parsed,
    hasToken: "token" in parsed,
  });
}
