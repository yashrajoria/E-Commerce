import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Local-only cookie debug helper that reports which auth cookie keys are present on the request.
 *
 * @remarks
 * Not wrapped in the admin auth guard. Disabled in production and unless explicitly enabled: it answers `404` when
 * `NODE_ENV` is `production` or `ENABLE_COOKIE_DEBUG` is not `1`. Set `ENABLE_COOKIE_DEBUG=1` in development if you
 * need to inspect cookies. The response contains the parsed cookie `keys` plus `has__session` and `hasToken` booleans.
 *
 * @param req - The Next.js API request; only `req.headers.cookie` is inspected.
 * @param res - The Next.js API response.
 * @returns The `NextApiResponse` produced by `res.json`, matching the handler signature.
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
