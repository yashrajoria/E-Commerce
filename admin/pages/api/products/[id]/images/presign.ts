import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const API_URL = getAdminApiBaseUrl();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  try {
    const cookie = req.headers.cookie || "";
    const body = req.body || {};

    const response = await axios.post(
      `${API_URL}bff/admin/products/${id}/images/presign`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Image presign proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Server error" });
  }
}

/**
 * Proxies `POST /api/products/[id]/images/presign` to the backend image presign endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Requires `req.query.id` and forwards the JSON body to `POST bff/admin/products/{id}/images/presign`, relaying the
 * upstream status and payload; failures are mapped through `getResponseInfo`.
 *
 * @param req - The Next.js API request; `req.query.id` is the product ID and `req.body` carries the presign request.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the presigned upload data or an error response has been sent.
 */
export default withAdminApi(handler);
