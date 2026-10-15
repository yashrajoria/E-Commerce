import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  AgentQueryRequest,
  AgentQueryResponseRaw,
  AgentQueryResult,
  AgentSessionMessage,
  AgentSessionResponseRaw,
  AgentToolDefinition,
  AgentToolResult,
  AgentToolsResponseRaw,
} from "@/types/ai-insights";

const REQUEST_TIMEOUT_MS = 25000;
const MAX_RETRIES = 1;

const isTransientError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (error.code === "ECONNABORTED") {
    return true;
  }

  if (!error.response) {
    return true;
  }

  const status = error.response.status;
  return (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestWithRetry<T>(config: AxiosRequestConfig): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      const response = await axios.request<T>({
        timeout: REQUEST_TIMEOUT_MS,
        withCredentials: true,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (attempt >= MAX_RETRIES || !isTransientError(error)) {
        throw error;
      }
      attempt += 1;
      await sleep(250 * attempt);
    }
  }
}

const normalizeToolResults = (toolResults: unknown): AgentToolResult[] => {
  if (!Array.isArray(toolResults)) {
    return [];
  }

  return toolResults.filter(
    (item): item is AgentToolResult =>
      typeof item === "object" && item !== null,
  );
};

const normalizeToolsCalled = (toolsCalled: unknown): string[] => {
  if (!Array.isArray(toolsCalled)) {
    return [];
  }
  return toolsCalled.filter((tool): tool is string => typeof tool === "string");
};

const deriveAnswer = (raw: AgentQueryResponseRaw): string => {
  if (typeof raw.answer === "string" && raw.answer.trim().length > 0) {
    return raw.answer;
  }
  if (typeof raw.response === "string" && raw.response.trim().length > 0) {
    return raw.response;
  }
  if (typeof raw.message === "string" && raw.message.trim().length > 0) {
    return raw.message;
  }
  return "I could not generate a full answer this time. Please try again.";
};

/**
 * Normalizes a raw agent response into the shape the AI Insights UI consumes.
 *
 * @param raw - Response body from the BFF `agent/query` endpoint.
 * @param requestedSessionId - Session id used as a fallback when the backend omits one.
 * @returns An {@link AgentQueryResult} with a guaranteed non-empty answer,
 * sanitized tool results/names and `partialSuccess` set when any tool call failed.
 */
export const normalizeQueryResponse = (
  raw: AgentQueryResponseRaw,
  requestedSessionId: string,
): AgentQueryResult => {
  const toolResults = normalizeToolResults(raw.tool_results);
  const toolsCalled = normalizeToolsCalled(raw.tools_called);

  const hasToolFailure = toolResults.some((toolResult) => {
    if (toolResult.success === false) {
      return true;
    }
    if (toolResult.status === "error") {
      return true;
    }
    return typeof toolResult.error === "string" && toolResult.error.length > 0;
  });

  const success = Boolean(raw.success);
  const partialSuccess = success && hasToolFailure;

  return {
    success,
    answer: deriveAnswer(raw),
    sessionId:
      typeof raw.session_id === "string" && raw.session_id.length > 0
        ? raw.session_id
        : requestedSessionId,
    toolResults,
    toolsCalled,
    correlationId:
      typeof raw.correlation_id === "string" ? raw.correlation_id : "",
    timestamp:
      typeof raw.timestamp === "string"
        ? raw.timestamp
        : new Date().toISOString(),
    latencyMs: typeof raw.latency_ms === "number" ? raw.latency_ms : null,
    partialSuccess,
    technicalDetails: raw.error,
  };
};

/**
 * Sends a prompt to the operations agent and normalizes the answer.
 *
 * @remarks
 * `POST /api/bff/admin/agent/query` with a 25s timeout and one retry for
 * transient failures (timeout, network error, 408/429/502/503/504).
 *
 * @param payload - Session id and prompt to send.
 * @returns The normalized {@link AgentQueryResult}.
 * @throws {@link Error} When the request fails after the retry budget is exhausted.
 */
export const queryAgent = async (
  payload: AgentQueryRequest,
): Promise<AgentQueryResult> => {
  const raw = await requestWithRetry<AgentQueryResponseRaw>({
    method: "POST",
    url: "/api/bff/admin/agent/query",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return normalizeQueryResponse(raw, payload.session_id);
};

/** Callbacks invoked while consuming a streaming agent answer. */
export interface AgentStreamCallbacks {
  /** Receives human-readable progress messages, e.g. `("tool", "Searching orders...")`. */
  onStatus?: (step: string, message: string) => void;
  /** Receives each streamed answer fragment. */
  onToken?: (delta: string) => void;
  /** Receives action-card payloads the agent wants to render. */
  onActionCard?: (card: Record<string, unknown>) => void;
  /** Receives the final `done` payload (session id, correlation id, answer). */
  onDone?: (data: Record<string, unknown>) => void;
  /** Receives the server-reported error message before the stream rejects. */
  onError?: (err: string) => void;
}

/**
 * Streams an agent answer over Server-Sent Events via `/api/bff/admin/agent/stream`.
 *
 * @param payload - Session id and prompt to send.
 * @param callbacks - Handlers for status, token, action-card, done and error frames.
 * @returns A promise that resolves when the stream ends.
 * @throws {@link Error} When the response is not ok, has no body, or the server
 * sends an `error` frame.
 */
export const streamAgentQuery = async (
  payload: AgentQueryRequest,
  callbacks: AgentStreamCallbacks,
): Promise<void> => {
  const response = await fetch("/api/bff/admin/agent/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok || !response.body) {
    throw new Error(`Streaming request failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() || "";

    for (const block of blocks) {
      if (!block.trim()) continue;
      const eventMatch = block.match(/^event:\s*([^\n\r]+)/m);
      const dataMatch = block.match(/^data:\s*([^\n\r]+)/m);
      if (!eventMatch || !dataMatch) continue;

      const eventType = eventMatch[1].trim();
      let parsedData: Record<string, unknown>;
      try {
        parsedData = JSON.parse(dataMatch[1].trim());
      } catch {
        continue;
      }

      if (eventType === "status" && callbacks.onStatus) {
        callbacks.onStatus(
          String(parsedData.step || ""),
          String(parsedData.message || ""),
        );
      } else if (eventType === "token" && callbacks.onToken) {
        callbacks.onToken(String(parsedData.delta || ""));
      } else if (eventType === "action_card" && callbacks.onActionCard) {
        callbacks.onActionCard(parsedData);
      } else if (eventType === "done" && callbacks.onDone) {
        callbacks.onDone(parsedData);
      } else if (eventType === "error") {
        const errorMsg =
          typeof parsedData.error === "string"
            ? parsedData.error
            : "Unknown stream error";
        if (callbacks.onError) callbacks.onError(errorMsg);
        throw new Error(errorMsg);
      }
    }
  }
};

/**
 * Loads the stored conversation history for an agent session.
 *
 * @param sessionId - Session id to fetch; an empty value short-circuits to `[]`.
 * @returns The valid user/assistant/system messages, or `[]` when the backend
 * returns an unexpected shape.
 * @throws {@link Error} When the request fails after the retry budget is exhausted.
 */
export const fetchSessionHistory = async (
  sessionId: string,
): Promise<AgentSessionMessage[]> => {
  if (!sessionId) {
    return [];
  }

  const raw = await requestWithRetry<AgentSessionResponseRaw>({
    method: "GET",
    url: `/api/bff/admin/agent/session/${encodeURIComponent(sessionId)}`,
  });

  const container = raw.data ?? raw;
  const messages =
    container.messages ??
    container.history ??
    raw.messages ??
    raw.history ??
    [];
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.filter(
    (item): item is AgentSessionMessage =>
      typeof item === "object" &&
      item !== null &&
      (item.role === "user" ||
        item.role === "assistant" ||
        item.role === "system") &&
      typeof item.content === "string",
  );
};

/**
 * Clears an agent session and its stored history (`DELETE` on the session resource).
 *
 * @param sessionId - Session id to clear; an empty value is a no-op.
 * @returns A promise that resolves once the backend confirms the deletion.
 * @throws {@link Error} When the delete request fails after the retry budget is exhausted.
 */
export const clearAgentSession = async (sessionId: string): Promise<void> => {
  if (!sessionId) {
    return;
  }

  await requestWithRetry({
    method: "DELETE",
    url: `/api/bff/admin/agent/session/${encodeURIComponent(sessionId)}`,
  });
};

/**
 * Loads the catalog of tools the operations agent can call.
 *
 * @returns The enabled tool definitions, or `[]` when the backend returns an unexpected shape.
 * @throws {@link Error} When the request fails after the retry budget is exhausted.
 */
export const fetchAgentTools = async (): Promise<AgentToolDefinition[]> => {
  const raw = await requestWithRetry<AgentToolsResponseRaw>({
    method: "GET",
    url: "/api/bff/admin/agent/tools",
  });

  const tools = raw.data?.tools ?? raw.tools ?? [];

  if (!Array.isArray(tools)) {
    return [];
  }

  return tools.filter(
    (tool): tool is AgentToolDefinition =>
      typeof tool === "object" &&
      tool !== null &&
      typeof (tool as { name?: string }).name === "string",
  );
};

/**
 * Maps an unknown request error to operator-friendly copy.
 *
 * @param error - The caught value; only axios errors are classified.
 * @returns A short message covering timeouts, rate limits, auth failures and 5xx outages.
 */
export const toFriendlyErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return "Something unexpected happened. Please try again in a moment.";
  }

  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  const status = error.response?.status;
  if (status === 429) {
    return "Too many requests right now. Please wait a moment and retry.";
  }
  if (status === 401 || status === 403) {
    return "Your session may have expired. Refresh the page and try again.";
  }
  if (status && status >= 500) {
    return "The AI service is temporarily unavailable. Please try again shortly.";
  }

  return "We could not complete your request right now. Please retry.";
};

/**
 * Extracts technical diagnostics from an unknown error for the details panel.
 *
 * @param error - The caught value.
 * @returns For axios errors an object with `message`, `code`, `status` and
 * `data`; otherwise the original value unchanged.
 */
export const extractTechnicalDetails = (error: unknown): unknown => {
  if (!axios.isAxiosError(error)) {
    return error;
  }

  const axiosError = error as AxiosError;
  return {
    message: axiosError.message,
    code: axiosError.code,
    status: axiosError.response?.status,
    data: axiosError.response?.data,
  };
};

/** A write the agent wants to perform that awaits explicit admin approval. */
export interface PendingMutation {
  /** Mutation id. */
  id: string;
  /** Request id used when confirming the mutation. */
  request_id: string;
  /** Id of the admin/user the mutation was requested for, or `null` when unknown. */
  user_id: string | null;
  /** Prompt that produced the mutation. */
  prompt: string;
  /** Tool the agent wants to run. */
  tool: string;
  /** Tool arguments as parsed JSON or a raw string. */
  arguments: Record<string, unknown> | string;
  /** Whether the tool performs a write. */
  mutating: boolean;
  /** Current approval status, e.g. `"pending"`. */
  status: string;
  /** ISO timestamp when the mutation was queued. */
  created_at?: string;
}

/**
 * Loads the mutations currently awaiting admin approval.
 *
 * @returns The pending {@link PendingMutation} records, or `[]` when the request fails.
 */
export const fetchPendingMutations = async (): Promise<PendingMutation[]> => {
  try {
    const response = await axios.get<PendingMutation[]>(
      "/api/agent/mutations",
      {
        withCredentials: true,
        timeout: 10000,
      },
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("fetchPendingMutations error:", error);
    return [];
  }
};

/**
 * Approves or rejects a pending agent mutation.
 *
 * @param requestId - Request id of the mutation to confirm.
 * @param approve - `true` to allow the mutation, `false` to reject it.
 * @returns `{ success: true, data }` with the backend payload, or
 * `{ success: false, data: error }` when the request failed.
 */
export const confirmMutation = async (
  requestId: string,
  approve: boolean,
): Promise<{ success: boolean; data?: unknown }> => {
  try {
    const response = await axios.post(
      `/api/agent/mutations/${requestId}/confirm`,
      { approve },
      { withCredentials: true, timeout: 15000 },
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`confirmMutation ${requestId} error:`, error);
    return { success: false, data: error };
  }
};

/**
 * Triggers an on-demand agent watchdog scan.
 *
 * @returns The scan summary: number of anomalies detected, incidents created
 * and optional per-anomaly details.
 * @throws {@link Error} When the scan request fails.
 */
export const triggerWatchdogScan = async (): Promise<{
  anomalies_detected: number;
  incidents_created: number;
  details?: unknown[];
}> => {
  const response = await axios.post(
    "/api/agent/watchdog/scan",
    {},
    { withCredentials: true, timeout: 15000 },
  );
  return response.data;
};
