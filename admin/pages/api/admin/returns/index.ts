import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbReturn {
  id: string;
  return_number: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  product_name: string;
  reason: string;
  status: string;
  amount: string | number;
  created_at: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbReturn>(`
      SELECT 
        id,
        return_number,
        order_id,
        order_number,
        customer_name,
        product_name,
        reason,
        status,
        amount,
        created_at
      FROM returns
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    const returns = rows.map((r) => ({
      id: r.return_number || r.id,
      dbId: r.id,
      orderId: r.order_number || r.order_id,
      customer: r.customer_name,
      product: r.product_name,
      reason: r.reason,
      status: (["pending", "approved", "rejected", "completed"].includes(r.status)
        ? r.status
        : "pending") as "pending" | "approved" | "rejected" | "completed",
      requestDate: new Date(r.created_at).toISOString().split("T")[0],
      amount: Number(r.amount) || 0,
    }));

    const totalOrdersCount = await query<{ count: string }>(
      "SELECT count(*) FROM orders"
    );
    const orderTotal = Number(totalOrdersCount[0]?.count) || 1;

    const refundedAmount = returns
      .filter((r) => r.status === "completed" || r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0);

    const stats = {
      total: returns.length,
      pending: returns.filter((r) => r.status === "pending").length,
      refunded: Number(refundedAmount.toFixed(2)),
      returnRate: Number(((returns.length / orderTotal) * 100).toFixed(1)),
    };

    return res.status(200).json({ returns, stats });
  } catch (error: any) {
    console.error("Returns API error:", error);
    return res.status(500).json({ error: "Failed to fetch returns from database" });
  }
}

export default withAdminApi(handler);

