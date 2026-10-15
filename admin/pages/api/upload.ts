import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getResponseInfo } from "@/lib/error";
import { getAdminApiBaseUrl } from "@/lib/backendUrl";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";
import { withAdminApi } from "@/lib/requireAdminApi";

/** Route configuration — disables the default body parser so `formidable` can parse the multipart upload. */
export const config = {
  api: { bodyParser: false },
};

const parseForm = (
  req: NextApiRequest,
): Promise<{
  fields: Record<string, unknown>;
  files: Record<string, unknown>;
}> => {
  const form = formidable({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const extractSessionCookie = (req: NextApiRequest): string =>
  req.headers.cookie?.trim() || "";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { files } = await parseForm(req);

    // Accept files under `file` or take the first file present
    const rawFile =
      (files as Record<string, unknown>)?.file || Object.values(files || {})[0];
    const file = Array.isArray(rawFile) ? rawFile[0] : rawFile;

    if (
      !file ||
      typeof file !== "object" ||
      !("filepath" in (file as Record<string, unknown>))
    )
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
      url: `${getAdminApiBaseUrl()}upload`,
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

/**
 * Uploads a single file through `POST /api/upload`.
 *
 * @remarks
 * Wrapped in {@link withAdminApi}, which enforces same-origin checks and an admin session before the proxy runs.
 * Parses the multipart form with `formidable`, reads the first supplied file (the `file` field, or whichever field
 * holds a file), and forwards it as multipart data to the backend `POST upload` endpoint with the incoming cookies;
 * failures are mapped through `getResponseInfo`.
 *
 * @param req - The Next.js API request; the file is read from the multipart form data.
 * @param res - The Next.js API response.
 * @returns A promise that resolves once the backend upload response has been relayed to the client.
 */
export default withAdminApi(handler);
