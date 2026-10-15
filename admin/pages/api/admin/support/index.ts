import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbTicket {
  id: string;
  ticket_number: string;
  customer_name: string;
  subject: string;
  priority: string;
  status: string;
  last_reply: string | null;
  created_at: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbTicket>(`
      SELECT 
        id,
        ticket_number,
        customer_name,
        subject,
        priority,
        status,
        last_reply,
        created_at
      FROM support_tickets
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    const tickets = rows.map((r) => ({
      id: r.ticket_number || r.id,
      dbId: r.id,
      subject: r.subject,
      customer: r.customer_name,
      priority: (["low", "medium", "high", "urgent"].includes(r.priority)
        ? r.priority
        : "medium") as "low" | "medium" | "high" | "urgent",
      status: (["open", "in-progress", "resolved", "closed"].includes(r.status)
        ? r.status
        : "open") as "open" | "in-progress" | "resolved" | "closed",
      createdAt: new Date(r.created_at).toISOString().split("T")[0],
      lastReply: r.last_reply || "Recent",
    }));

    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
    };

    return res.status(200).json({ tickets, stats });
  } catch (error) {
    console.error("Support API error:", error);
    return res.status(500).json({ error: "Failed to fetch support tickets from database" });
  }
}

export default withAdminApi(handler);

