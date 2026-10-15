import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbLog {
  id: string;
  user_name: string;
  action: string;
  target: string;
  type: string;
  ip_address: string;
  created_at: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbLog>(`
      SELECT 
        id,
        user_name,
        action,
        target,
        type,
        ip_address,
        created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    const logs = rows.map((r, idx) => ({
      id: String(idx + 1),
      dbId: r.id,
      user: r.user_name || "Admin",
      action: r.action,
      target: r.target,
      type: (["create", "update", "delete", "auth", "system"].includes(r.type)
        ? r.type
        : "system") as "create" | "update" | "delete" | "auth" | "system",
      timestamp: new Date(r.created_at)
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      ip: r.ip_address || "127.0.0.1",
    }));

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    const todayCount = rows.filter(
      (r) => new Date(r.created_at).getTime() >= todayStart,
    ).length;

    const stats = {
      total: logs.length,
      today: todayCount || logs.length,
      security: logs.filter((l) => l.type === "auth").length,
      errors: logs.filter(
        (l) =>
          l.action.toLowerCase().includes("fail") ||
          l.action.toLowerCase().includes("error"),
      ).length,
    };

    return res.status(200).json({ logs, stats });
  } catch (error) {
    console.error("Activity Logs API error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch activity logs from database" });
  }
}

/**
 * Handles `GET` requests for the admin activity log feed, returning the 100 most recent entries with dashboard statistics.
 *
 * @remarks
 * Wrapped with {@link withAdminApi}: requests must pass a same-origin check and carry a valid admin session.
 *
 * @param req - The Next.js API request; no query parameters or body are read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the response has been sent.
 */
export default withAdminApi(handler);
