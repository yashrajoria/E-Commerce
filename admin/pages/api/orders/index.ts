import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const query = req.query;

    const { page, limit } = query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const cookie = req.headers.cookie;

    try {
      const apiRes = await axios.get(
        `${getAdminApiBaseUrl()}bff/admin/orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
          },
          params: {
            page: pageNumber,
            limit: limitNumber,
          },
          withCredentials: true,
        },
      );
      // console.log({ apiRes });
      const orders = apiRes?.data?.orders;
      const meta = apiRes?.data?.meta;
      // console.log({ orders });
      // console.log({ meta });
      res.status(200).json({ orders, meta });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Orders proxy error:",
          error.response?.data || error.message,
        );
        return res
          .status(error.response?.status || 500)
          .json({ error: error.response?.data || "Internal server error" });
      }
      console.error("Unexpected orders proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

/**
 * Proxies `GET /api/orders` to the backend admin order list.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Forwards `page` and `limit` to `GET bff/admin/orders` and returns `{ orders, meta }`. Requests using any other
 * method fall through without writing a response.
 *
 * @param req - The Next.js API request; the optional `page` and `limit` query parameters are forwarded.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the order list has been sent for `GET` requests.
 */
export default withAdminApi(handler);
