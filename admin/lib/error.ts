/**
 * Extracts a human-readable message from any thrown value.
 *
 * @param err - The caught value; may be an `Error`, a string or arbitrary data.
 * @returns `err.message` for errors, the string itself for strings, otherwise a
 * JSON rendering (falling back to `String(err)` when the value cannot be serialized).
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Reads the HTTP status, body and headers off an axios-style error object.
 *
 * @param err - The caught value to inspect.
 * @returns The response fields when `err.response` exists, otherwise an empty object.
 */
export function getResponseInfo(err: unknown): {
  status?: number;
  data?: unknown;
  headers?: unknown;
} {
  if (typeof err === "object" && err !== null && "response" in err) {
    const resp = (err as { response?: unknown }).response;
    if (typeof resp === "object" && resp !== null) {
      const status = (resp as { status?: number }).status;
      const data = (resp as { data?: unknown }).data;
      const headers = (resp as { headers?: unknown }).headers;
      return { status, data, headers };
    }
  }
  return {};
}
