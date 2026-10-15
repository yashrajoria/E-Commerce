import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbCampaign {
  id: string;
  name: string;
  status: string;
  reach: number;
  conversions: number;
  revenue: string | number;
  start_date: string;
  end_date: string | null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbCampaign>(`
      SELECT 
        id,
        name,
        status,
        reach,
        conversions,
        revenue,
        start_date,
        end_date
      FROM campaigns
      ORDER BY created_at DESC;
    `);

    const campaigns = rows.map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      reach: Number(r.reach) || 0,
      conversions: Number(r.conversions) || 0,
      revenue: Number(r.revenue) || 0,
      startDate: r.start_date,
      endDate: r.end_date,
    }));

    return res.status(200).json({ campaigns });
  } catch (error) {
    console.error("Campaigns API error:", error);
    return res.status(500).json({ error: "Failed to fetch campaigns from database" });
  }
}

export default withAdminApi(handler);

