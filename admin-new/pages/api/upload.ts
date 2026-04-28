import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Record<string, unknown>; files: Record<string, unknown> }> => {
  const form = formidable({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const extractSessionCookie = (req: NextApiRequest): string => {
  const sessionCookie = req.headers.cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("__session="));
  return sessionCookie?.trim() || "";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { files } = await parseForm(req);

    // Accept files under `file` or take the first file present
    const rawFile = (files as Record<string, unknown>)?.file || Object.values(files || {})[0];
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (!file || typeof file !== "object" || !("filepath" in (file as Record<string, unknown>)))
      return res.status(400).json({ message: "No file uploaded" });

    const fileObj = file as Record<string, unknown>;
    const filepath = String(fileObj.filepath);
    const buffer = await fs.promises.readFile(filepath);

    const formData = new FormData();
    formData.append("file", buffer, {
      filename: String(fileObj.originalFilename ?? "upload.bin"),
      contentType: String(fileObj.mimetype ?? "application/octet-stream"),
    });

    const cookie = extractSessionCookie(req);

    // Proxy to backend upload endpoint
    const response = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_NEW_API_URL}upload`,
      data: formData,
      headers: {
        ...formData.getHeaders(),
        Cookie: cookie,
      },
      withCredentials: true,
    });

    return res.status(response.status).json(response.data);
  } catch (err: unknown) {
    console.error("Upload proxy error:", err);
    const { status, data } = getResponseInfo(err);
    return res.status(status || 500).json({ message: data ?? "Upload failed" });
  }
}
