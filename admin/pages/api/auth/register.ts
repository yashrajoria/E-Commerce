import type { NextApiRequest, NextApiResponse } from "next";
import { proxyRequest } from "@ecommerce/shared";

/**
 * Invite / provision an admin (or user) via the protected gateway route.
 * Requires an existing admin session cookie — public self-signup is not supported.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const deny = (status: number, message: string) =>
    res.status(status).json({
      error: status === 401 ? "Authentication required" : "Forbidden",
      message,
    });

  // Cookie presence alone is not auth — verify via gateway status.
  try {
    const statusResponse = await proxyRequest({
      req: {
        method: "GET",
        url: "/auth/status",
        headers: req.headers,
      },
      targetPath: "/auth/status",
      sanitizeSetCookie: true,
    });

    if (statusResponse.status >= 400) {
      return deny(
        401,
        "Admin accounts cannot be self-registered. Sign in with the seeded admin (ADMIN_EMAIL), then invite users from the dashboard.",
      );
    }

    let statusBody: unknown = null;
    try {
      statusBody = JSON.parse(statusResponse.body);
    } catch {
      statusBody = null;
    }

    const user =
      statusBody &&
      typeof statusBody === "object" &&
      "user" in statusBody &&
      (statusBody as { user?: { role?: string } }).user
        ? (statusBody as { user: { role?: string } }).user
        : null;
    const role = String(user?.role || "").toLowerCase();
    if (role !== "admin") {
      return deny(
        403,
        "Only an authenticated admin can invite additional users.",
      );
    }
  } catch (err) {
    console.error("Admin invite auth check failed:", err);
    return deny(
      401,
      "Admin accounts cannot be self-registered. Sign in with the seeded admin (ADMIN_EMAIL), then invite users from the dashboard.",
    );
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : { ...(req.body as Record<string, unknown>) };

    // Invite role is chosen by an authenticated admin only — never trust arbitrary client roles.
    const inviteRole = body.role === "user" ? "user" : "admin";
    delete body.role;

    const response = await proxyRequest({
      req: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: {
          ...body,
          role: inviteRole,
        },
      },
      targetPath: "/bff/admin/users",
      sanitizeSetCookie: true,
    });

    for (const [header, value] of Object.entries(response.headers)) {
      res.setHeader(header, value);
    }

    return res.status(response.status).send(response.body);
  } catch (err) {
    console.error("Admin invite proxy error:", err);
    return res.status(500).json({ message: "Failed to create user" });
  }
}
