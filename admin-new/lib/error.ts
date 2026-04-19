export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

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
