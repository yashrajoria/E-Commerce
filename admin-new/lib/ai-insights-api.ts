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
  return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
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

  return toolResults.filter((item): item is AgentToolResult => typeof item === "object" && item !== null);
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
    correlationId: typeof raw.correlation_id === "string" ? raw.correlation_id : "",
    timestamp: typeof raw.timestamp === "string" ? raw.timestamp : new Date().toISOString(),
    latencyMs: typeof raw.latency_ms === "number" ? raw.latency_ms : null,
    partialSuccess,
    technicalDetails: raw.error,
  };
};

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
  const messages = container.messages ?? container.history ?? raw.messages ?? raw.history ?? [];
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.filter(
    (item): item is AgentSessionMessage =>
      typeof item === "object" &&
      item !== null &&
      (item.role === "user" || item.role === "assistant" || item.role === "system") &&
      typeof item.content === "string",
  );
};

export const clearAgentSession = async (sessionId: string): Promise<void> => {
  if (!sessionId) {
    return;
  }

  await requestWithRetry({
    method: "DELETE",
    url: `/api/bff/admin/agent/session/${encodeURIComponent(sessionId)}`,
  });
};

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
