const DEFAULT_API_BASE_URL = "http://172.16.14.140:8080";

type HeaderValue = string | string[] | undefined;

type ProxyRequestInput = {
  method?: string;
  url?: string;
  headers?: Record<string, HeaderValue>;
  body?: unknown;
};

type ProxyRequestOptions = {
  req: ProxyRequestInput;
  targetPath: string;
  sanitizeSetCookie?: boolean;
  // If true, remove top-level sensitive fields (e.g. `role`) from JSON request bodies
  sanitizeRequestBody?: boolean;
};

type ProxyResponse = {
  status: number;
  body: string;
  headers: Record<string, string | string[]>;
};

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "transfer-encoding",
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "content-encoding",
  "transfer-encoding",
]);

export const getBackendBaseUrl = () =>
  (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NEW_API_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, "");

export function sanitizeSetCookies(raw: string[]) {
  const isProd = process.env.NODE_ENV === "production";

  return raw.map((cookie) => {
    let nextCookie = cookie.replace(/;?\s*Domain=[^;]*/gi, "");

    if (!isProd) {
      nextCookie = nextCookie.replace(/;?\s*Secure/gi, "");
      nextCookie = nextCookie.replace(/SameSite=None/gi, "SameSite=Lax");
    }

    if (!/Path=/i.test(nextCookie)) {
      nextCookie += "; Path=/";
    }

    return nextCookie;
  });
}

function getSetCookieValues(headers: Headers) {
  const cookieHeaders = (
    headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie?.();

  if (cookieHeaders && cookieHeaders.length > 0) {
    return cookieHeaders;
  }

  const singleCookie = headers.get("set-cookie");
  return singleCookie ? [singleCookie] : [];
}

function buildForwardHeaders(
  incomingHeaders: Record<string, HeaderValue> = {},
  backendBaseUrl: string,
) {
  const headers = new Headers();

  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase()) || value == null) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  try {
    headers.set("host", new URL(backendBaseUrl).host);
  } catch {
    // Ignore invalid backend base URLs and let fetch handle the request.
  }

  return headers;
}

function buildRequestBody(method: string, body: unknown) {
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return undefined;
  }

  if (body == null) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

export async function proxyRequest({
  req,
  targetPath,
  sanitizeSetCookie = false,
  sanitizeRequestBody = false,
}: ProxyRequestOptions): Promise<ProxyResponse> {
  const backendBaseUrl = getBackendBaseUrl();
  const requestUrl = new URL(req.url ?? "/", "http://localhost");
  const method = (req.method || "GET").toUpperCase();
  const targetUrl = `${backendBaseUrl}${targetPath}${requestUrl.search}`;
  // Optionally sanitize request body (remove client-supplied sensitive hints)
  let outgoingBody: unknown = req.body;
  if (
    sanitizeRequestBody &&
    outgoingBody != null &&
    !["GET", "HEAD", "OPTIONS"].includes(method)
  ) {
    try {
      if (typeof outgoingBody === "string") {
        const parsed = JSON.parse(outgoingBody);
        if (parsed && typeof parsed === "object") {
          // remove top-level role if present
          delete (parsed as Record<string, unknown>).role;
          outgoingBody = parsed;
        }
      } else if (typeof outgoingBody === "object") {
        // shallow clone via JSON to avoid mutating original
        const clone = JSON.parse(JSON.stringify(outgoingBody));
        if (clone && typeof clone === "object") {
          delete (clone as Record<string, unknown>).role;
          outgoingBody = clone;
        }
      }
    } catch {
      // if parsing/cloning fails, fall back to original body
      outgoingBody = req.body;
    }
  }

  const response = await fetch(targetUrl, {
    method,
    headers: buildForwardHeaders(req.headers, backendBaseUrl),
    body: buildRequestBody(method, outgoingBody),
  });

  const headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const setCookie = getSetCookieValues(response.headers);
  if (setCookie.length > 0) {
    headers["set-cookie"] = sanitizeSetCookie
      ? sanitizeSetCookies(setCookie)
      : setCookie;
  }

  return {
    status: response.status,
    body: await response.text(),
    headers,
  };
}
