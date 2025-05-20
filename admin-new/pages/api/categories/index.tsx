import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export const config = {
  api: {
    bodyParser: false, // Required for formidable to work
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const cookie = req.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="));
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}categories/`,
        {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie || "",
          },
          withCredentials: true,
        }
      );
      return res.status(response.status).json(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
