import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";

import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const API_URL = getAdminApiBaseUrl();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const sku = (req.query.sku as string) || undefined;
    const cookie = req.headers.cookie || "";

    // Must use admin BFF path — public GET /products/* does not inject X-User-Role.
    const url = sku
      ? `${API_URL}bff/admin/products/presign?sku=${encodeURIComponent(sku)}`
      : `${API_URL}bff/admin/products/presign`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Presign proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Server error" });
  }
}

/**
 * Proxies `GET /api/products/presign` to the backend admin presign endpoint.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Calls `GET bff/admin/products/presign` (with an optional `sku` query parameter) because the public products API
 * does not inject the `X-User-Role` header; failures are mapped through `getResponseInfo`.
 *
 * @param req - The Next.js API request; the optional `sku` query parameter is forwarded to the backend.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the presign data or an error response has been sent.
 */
export default withAdminApi(handler);
