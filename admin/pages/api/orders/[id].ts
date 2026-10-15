import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { NextApiRequest, NextApiResponse } from "next";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const cookie = req.headers.cookie || "";

  try {
    const apiRes = await axios.get(
      `${getAdminApiBaseUrl()}bff/admin/orders/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );

    return res.status(200).json(apiRes.data);
  } catch (error: unknown) {
    console.error("Error fetching order:", error);
    const { status } = getResponseInfo(error);
    return res.status(status || 500).json({
      message: "Failed to fetch order",
    });
  }
}

/**
 * Proxies `GET /api/orders/[id]` to the backend admin order detail endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Fetches `GET bff/admin/orders/{id}` with the incoming cookies and relays the response body; upstream failures are
 * mapped to their status through `getResponseInfo`.
 *
 * @param req - The Next.js API request; `req.query.id` identifies the order.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the order payload or an error response has been sent.
 */
export default withAdminApi(handler);
