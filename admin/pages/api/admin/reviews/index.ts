import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAdminApi } from "@/lib/requireAdminApi";

interface DbReview {
  id: string;
  customer_name: string;
  product_name: string;
  rating: number;
  comment: string;
  status: string;
  helpful_count: number;
  created_at: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rows = await query<DbReview>(`
      SELECT 
        id,
        customer_name,
        product_name,
        rating,
        comment,
        status,
        helpful_count,
        created_at
      FROM reviews
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    const reviews = rows.map((r, idx) => ({
      id: String(idx + 1),
      dbId: r.id,
      customer: r.customer_name,
      product: r.product_name,
      rating: Number(r.rating) || 5,
      comment: r.comment,
      date: new Date(r.created_at).toISOString().split("T")[0],
      status: (["published", "pending", "flagged"].includes(r.status)
        ? r.status
        : "published") as "published" | "pending" | "flagged",
      helpful: Number(r.helpful_count) || 0,
    }));

    const avg =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1),
          )
        : 5.0;

    const stats = {
      total: reviews.length,
      avgRating: avg,
      published: reviews.filter((r) => r.status === "published").length,
      flagged: reviews.filter((r) => r.status === "flagged").length,
      pending: reviews.filter((r) => r.status === "pending").length,
    };

    return res.status(200).json({ reviews, stats });
  } catch (error) {
    console.error("Reviews API error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch reviews from database" });
  }
}

/**
 * Handles `GET` requests for the admin review list, returning the 100 most recent reviews with rating statistics.
 *
 * @remarks
 * Wrapped with {@link withAdminApi}: requests must pass a same-origin check and carry a valid admin session.
 *
 * @param req - The Next.js API request; no query parameters or body are read.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the response has been sent.
 */
export default withAdminApi(handler);
