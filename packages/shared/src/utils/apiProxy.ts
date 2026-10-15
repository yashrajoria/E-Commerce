const DEFAULT_API_BASE_URL = "http://localhost:8080";

type HeaderValue = string | string[] | undefined;

/** Minimal structural view of the incoming Next.js API request that {@link proxyRequest} forwards. */
type ProxyRequestInput = {
  /** HTTP method to use; defaults to `GET` when omitted. */
  method?: string;
  /** Incoming URL, used for its query string (the path is replaced by `targetPath`). */
  url?: string;
  /** Incoming request headers, forwarded minus hop-by-hop headers. */
  headers?: Record<string, HeaderValue>;
  /** Request body already parsed by the API route, if any. */
  body?: unknown;
};

/** Options accepted by {@link proxyRequest}. */
type ProxyRequestOptions = {
  /** Incoming Next.js API request to forward. */
  req: ProxyRequestInput;
  /** Backend path to call, including any path parameters; the incoming query string is preserved. */
  targetPath: string;
  /** When `true`, strips `Domain`/`Secure` attributes and forces `Path=/` on forwarded `Set-Cookie` headers. */
  sanitizeSetCookie?: boolean;
  /** When `true`, removes top-level sensitive fields (e.g. `role`) from JSON request bodies. */
  sanitizeRequestBody?: boolean;
  /** Abort timeout in milliseconds; see {@link proxyRequest} for the default. */
  timeoutMs?: number;
};

/** Proxied backend response handed back to the Next.js API route. */
type ProxyResponse = {
  /** HTTP status code from the backend, or `504` when the request timed out. */
  status: number;
  /** Response body as text. */
  body: string;
  /** Response headers minus hop-by-hop headers, including any `set-cookie` entries. */
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

/**
 * Resolves the backend base URL used for server-side proxying.
 *
 * @returns The first configured value of `API_BASE_URL`,
 * `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_NEW_API_URL`, otherwise
 * `http://localhost:8080`, with any trailing slashes removed.
 */
export const getBackendBaseUrl = () =>
  (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NEW_API_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, "");

/**
 * Normalizes forwarded `Set-Cookie` headers for the Next.js app.
 *
 * @remarks
 * Removes the `Domain` attribute and forces `Path=/` so cookies reach the
 * Next.js API proxies, not only backend paths. Outside production it also
 * drops the `Secure` flag and relaxes `SameSite=None` to `SameSite=Lax`,
 * which local HTTP development requires.
 *
 * @param raw - Raw `Set-Cookie` header values from the backend response.
 * @returns A new array of sanitized cookie strings.
 */
export function sanitizeSetCookies(raw: string[]) {
  const isProd = process.env.NODE_ENV === "production";

  return raw.map((cookie) => {
    let nextCookie = cookie.replace(/;?\s*Domain=[^;]*/gi, "");

    if (!isProd) {
      nextCookie = nextCookie.replace(/;?\s*Secure/gi, "");
      nextCookie = nextCookie.replace(/SameSite=None/gi, "SameSite=Lax");
    }

    // Always Path=/ so cookies reach Next.js API proxies (e.g. /api/admin/auth/*),
    // not only backend paths like /auth/refresh.
    nextCookie = nextCookie.replace(/;?\s*Path=[^;]*/gi, "");
    nextCookie += "; Path=/";

    return nextCookie;
  });
}

/** Reads `Set-Cookie` values from a fetch response, preferring the runtime's `getSetCookie()` API. */
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

/** Copies incoming headers into a `Headers` object, dropping hop-by-hop headers and pinning the backend `host`. */
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

/** Serializes a request body for `fetch`, omitting it for methods that must not carry one. */
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

/**
 * Forwards a Next.js API request to the backend and returns the raw response.
 *
 * @remarks
 * Strips hop-by-hop headers in both directions, preserves the incoming query
 * string, serializes JSON bodies, and converts an abort/timeout into a `504`
 * JSON response so route handlers can surface a friendly error.
 *
 * @param options - The request, target path, sanitization flags and timeout to use; `timeoutMs` defaults to `8500` (8.5 seconds) so a cold backend has room to wake up.
 * @returns A promise resolving to the proxied status, body text and headers.
 * @throws {@link Error} When the backend fetch fails for any reason other than a timeout — the rejection is rethrown unchanged.
 *
 * @example
 * ```ts
 * const response = await proxyRequest({
 *   req,
 *   targetPath: "/auth/login",
 *   sanitizeSetCookie: true,
 *   sanitizeRequestBody: true,
 * });
 * res.status(response.status).send(response.body);
 * ```
 */
export async function proxyRequest({
  req,
  targetPath,
  sanitizeSetCookie = false,
  sanitizeRequestBody = false,
  timeoutMs = 8500,
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

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method,
      headers: buildForwardHeaders(req.headers, backendBaseUrl),
      body: buildRequestBody(method, outgoingBody),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError")
    ) {
      return {
        status: 504,
        body: JSON.stringify({
          error: "Gateway Timeout",
          message:
            "The backend service took too long to respond. It may be waking up, please retry shortly.",
        }),
        headers: { "content-type": "application/json" },
      };
    }
    throw error;
  }

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
