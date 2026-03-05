import axios from "axios";
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
      `${process.env.NEXT_PUBLIC_NEW_API_URL}orders/${id}`,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    console.error("Error fetching order:", error);
    const status =
      typeof error === "object" && error !== null && "response" in error
        ? (error as any).response?.status
        : 500;
    const errData =
      typeof error === "object" && error !== null && "response" in error
        ? (error as any).response?.data
        : (error instanceof Error ? error.message : String(error));
    return res.status(status || 500).json({
      message: "Failed to fetch order",
      error: errData,
    });
  }
}
