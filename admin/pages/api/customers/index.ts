import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import { withAdminApi } from "@/lib/requireAdminApi";

const jsonError = (res: NextApiResponse, status: number, error: string) =>
  res.status(status).json({ error });

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { page = "1", page_size = "20" } = req.query;
  const cookie = req.headers.cookie;

  try {
    const apiRes = await axios.get(`${getAdminApiBaseUrl()}bff/admin/users`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      params: {
        page: parseInt(page as string, 10) || 1,
        page_size: parseInt(page_size as string, 10) || 20,
      },
      withCredentials: true,
    });

    const users = apiRes?.data?.users || [];
    const meta = apiRes?.data?.meta || {};

    res.status(200).json({ users, meta });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching customers:",
        error.response?.status || error.message,
      );
      const status = error.response?.status || 500;
      return jsonError(res, status, "Failed to fetch customers");
    }
    console.error("Unexpected error fetching customers:", error);
    jsonError(res, 500, "Failed to fetch customers");
  }
}

/** Provisions a ShopSwift account through `POST /bff/admin/users`. */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password, role } = (req.body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 8 ||
    (role !== "admin" && role !== "user")
  ) {
    return jsonError(
      res,
      400,
      "name, email, password (min 8 chars) and role (admin|user) are required",
    );
  }

  try {
    const apiRes = await axios.post(
      `${getAdminApiBaseUrl()}bff/admin/users`,
      { name: name.trim(), email: email.trim(), password, role },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie,
        },
        withCredentials: true,
      },
    );

    res.status(apiRes.status).json(apiRes.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        (error.response?.data as { error?: string } | undefined)?.error ||
        "Failed to create customer";
      console.error("Error creating customer:", status, message);
      return jsonError(res, status, message);
    }
    console.error("Unexpected error creating customer:", error);
    jsonError(res, 500, "Failed to create customer");
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return handleGet(req, res);
  if (req.method === "POST") return handlePost(req, res);
  return jsonError(res, 405, "Method not allowed");
}

export default withAdminApi(handler);
