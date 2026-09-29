import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { backendUrl } from "@/lib/backend";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;
  const cookie = req.headers.cookie || "";

  try {
    const apiRes = await axios.get(
      backendUrl(`orders/${id}`),
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        withCredentials: true,
      }
    );

    const order = apiRes.data;
    console.log({ order });
    return res.status(200).json(order);
  } catch (error: unknown) {
    console.error("Error fetching order:", error);
    const { status, data } = getResponseInfo(error);
    const errData = data ?? (error instanceof Error ? error.message : String(error));
    return res.status(status || 500).json({
      message: "Failed to fetch order",
      error: errData,
    });
  }
}
