import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.method);
  if (req.method === "GET") {
    const query = req.query;

    const { page, limit } = query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    // const offset = (pageNumber - 1) * limitNumber;
    const cookie = req.headers.cookie;
    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_NEW_API_URL}orders`,
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
      }
    );
    // console.log({ apiRes });
    const orders = apiRes?.data?.orders;
    const meta = apiRes?.data?.meta;
    // console.log({ orders });
    // console.log({ meta });
    res.status(200).json({ orders, meta });
  }
}
