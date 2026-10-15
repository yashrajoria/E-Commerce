import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbShipment {
  id: string;
  order_id: string;
  order_number: string | null;
  customer_name: string | null;
  destination: string | null;
  carrier: string | null;
  tracking_code: string;
  status: string;
  created_at: string;
  estimated_delivery: string | null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbShipment>(`
      SELECT 
        s.id,
        s.order_id,
        COALESCE(o.order_number, 'ORD-' || substring(s.order_id::text, 1, 8)) AS order_number,
        COALESCE(u.name, 'Customer') AS customer_name,
        COALESCE(
          s.destination,
          a.city || ', ' || a.state,
          'Standard Shipping Address'
        ) AS destination,
        COALESCE(s.carrier, 'FedEx') AS carrier,
        s.tracking_code,
        s.status,
        s.created_at,
        s.estimated_delivery
      FROM shipments s
      LEFT JOIN orders o ON o.id = s.order_id
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN addresses a ON a.user_id = u.id AND a.type = 'shipping'
      ORDER BY s.created_at DESC
      LIMIT 100;
    `);

    const shipments = rows.map((r, index) => {
      let progress = 30;
      const st = r.status.toLowerCase().replace("_", "-");
      if (st === "delivered") progress = 100;
      else if (st === "in-transit" || st === "in_transit") progress = 65;
      else if (st === "shipped") progress = 40;
      else if (st === "delayed") progress = 45;
      else progress = 15;

      const normStatus:
        | "processing"
        | "shipped"
        | "in-transit"
        | "delivered"
        | "delayed" =
        st === "in_transit"
          ? "in-transit"
          : st === "delivered" ||
              st === "shipped" ||
              st === "delayed" ||
              st === "in-transit"
            ? (st as
                | "processing"
                | "shipped"
                | "in-transit"
                | "delivered"
                | "delayed")
            : "processing";

      const estDate = r.estimated_delivery
        ? new Date(r.estimated_delivery).toISOString().split("T")[0]
        : new Date(new Date(r.created_at).getTime() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

      return {
        id: `SHP-${String(index + 1).padStart(3, "0")}`,
        dbId: r.id,
        orderId: r.order_number || r.order_id,
        customer: r.customer_name || "Customer",
        destination: r.destination || "United States",
        carrier: r.carrier || "FedEx",
        tracking: r.tracking_code,
        status: normStatus,
        estimatedDate: estDate,
        progress,
      };
    });

    const stats = {
      total: shipments.length,
      inTransit: shipments.filter((s) => s.status === "in-transit").length,
      delivered: shipments.filter((s) => s.status === "delivered").length,
      delayed: shipments.filter((s) => s.status === "delayed").length,
      processing: shipments.filter((s) => s.status === "processing").length,
    };

    return res.status(200).json({ shipments, stats });
  } catch (error) {
    console.error("Shipping API error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch shipments from database" });
  }
}

/**
 * Handles `GET` requests for the admin shipment list, joining shipments with their order, customer and address records.
 *
 * @remarks
 * Wrapped with {@link withAdminApi}: requests must pass a same-origin check and carry a valid admin session.
 *
 * @param req - The Next.js API request; no query parameters or body are read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the response has been sent.
 */
export default withAdminApi(handler);
