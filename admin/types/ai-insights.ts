/** Body sent to the operations agent `query` endpoint. */
export interface AgentQueryRequest {
  /** Identifier of the conversation session the prompt belongs to. */
  session_id: string;
  /** Operator prompt to send to the agent. */
  prompt: string;
}

/** Result of a single tool invocation performed by the operations agent. */
export interface AgentToolResult {
  /** Optional unique id of the tool call. */
  id?: string;
  /** Tool identifier, e.g. `orders.search`. */
  tool?: string;
  /** Human-readable tool name. */
  name?: string;
  /** Whether the tool call succeeded, when the backend reports it as a boolean. */
  success?: boolean;
  /** Coarse outcome of the tool call. */
  status?: "success" | "error" | "partial";
  /** Wall-clock duration of the tool call in milliseconds. */
  duration_ms?: number;
  /** ISO timestamp when the tool call started. */
  started_at?: string;
  /** ISO timestamp when the tool call finished. */
  finished_at?: string;
  /** Arguments the agent passed to the tool. */
  input?: unknown;
  /** Value returned by the tool. */
  output?: unknown;
  /** Error message when the tool call failed. */
  error?: string;
  /** Additional backend fields passed through unchanged. */
  [key: string]: unknown;
}

/** Unnormalized agent response as returned by the BFF `query` endpoint. */
export interface AgentQueryResponseRaw {
  /** Whether the agent completed the request successfully. */
  success?: boolean;
  /** Preferred answer field. */
  answer?: string;
  /** Alternate answer field used by some backend versions. */
  response?: string;
  /** Fallback message field used when no answer is produced. */
  message?: string;
  /** Tool invocations performed while answering. */
  tool_results?: AgentToolResult[];
  /** Names of the tools the agent called. */
  tools_called?: string[];
  /** Correlation id useful for tracing the request through logs. */
  correlation_id?: string;
  /** ISO timestamp reported by the backend. */
  timestamp?: string;
  /** Server-side latency in milliseconds. */
  latency_ms?: number;
  /** Session id the backend associated with the query. */
  session_id?: string;
  /** Raw error payload when the request failed. */
  error?: unknown;
  /** Additional backend fields passed through unchanged. */
  [key: string]: unknown;
}

/** Normalized agent answer consumed by the AI Insights UI. */
export interface AgentQueryResult {
  /** Whether the backend reported the request as successful. */
  success: boolean;
  /** Guaranteed non-empty answer text (falls back to a retry hint). */
  answer: string;
  /** Session id, falling back to the one requested by the client. */
  sessionId: string;
  /** Tool invocations performed while answering. */
  toolResults: AgentToolResult[];
  /** Names of the tools the agent called. */
  toolsCalled: string[];
  /** Correlation id, or an empty string when the backend omitted it. */
  correlationId: string;
  /** ISO timestamp of the response. */
  timestamp: string;
  /** Server-side latency in milliseconds, or `null` when not reported. */
  latencyMs: number | null;
  /** `true` when the answer succeeded but at least one tool call failed. */
  partialSuccess: boolean;
  /** Raw backend error payload, surfaced in the technical-details panel. */
  technicalDetails?: unknown;
}

/** One turn of stored conversation history for an agent session. */
export interface AgentSessionMessage {
  /** Who produced the message. */
  role: "user" | "assistant" | "system";
  /** Message text. */
  content: string;
  /** ISO timestamp when the message was recorded. */
  timestamp?: string;
  /** Correlation id of the request that produced the message. */
  correlation_id?: string;
}

/** Unnormalized session-history response; messages may sit at the top level or under `data`. */
export interface AgentSessionResponseRaw {
  /** Whether the history lookup succeeded. */
  success?: boolean;
  /** Session id the history belongs to. */
  session_id?: string;
  /** Conversation messages, preferred location. */
  messages?: AgentSessionMessage[];
  /** Conversation messages, alternate field name. */
  history?: AgentSessionMessage[];
  /** Nested container used by some backend versions. */
  data?: {
    /** Conversation messages inside the nested container. */
    messages?: AgentSessionMessage[];
    /** Conversation messages inside the nested container, alternate field name. */
    history?: AgentSessionMessage[];
  };
  /** Additional backend fields passed through unchanged. */
  [key: string]: unknown;
}

/** Description of a tool the operations agent can call. */
export interface AgentToolDefinition {
  /** Optional stable id of the tool. */
  id?: string;
  /** Tool name used when invoking it. */
  name: string;
  /** Human-readable explanation of what the tool does. */
  description?: string;
  /** Whether the tool is currently enabled for the agent. */
  enabled?: boolean;
  /** Additional backend fields passed through unchanged. */
  [key: string]: unknown;
}

/** Unnormalized tool-catalog response; tools may sit at the top level or under `data`. */
export interface AgentToolsResponseRaw {
  /** Tool definitions at the top level. */
  tools?: AgentToolDefinition[];
  /** Nested container used by some backend versions. */
  data?: {
    /** Tool definitions inside the nested container. */
    tools?: AgentToolDefinition[];
  };
  /** Additional backend fields passed through unchanged. */
  [key: string]: unknown;
}

/** Lifecycle phase of an AI Insights request as tracked by {@link useAIInsights}. */
export type RequestLifecycle =
  | "idle"
  | "bootstrapping"
  | "loading"
  | "success"
  | "error"
  | "partial";

/** A completed prompt/answer pair shown in the prompt history list. */
export interface PromptHistoryItem {
  /** Unique id derived from the prompt, answer and timestamp. */
  id: string;
  /** The operator prompt. */
  prompt: string;
  /** The agent answer for that prompt. */
  answer: string;
  /** ISO timestamp when the pair was recorded. */
  createdAt: string;
  /** Correlation id for tracing, or an empty string when absent. */
  correlationId: string;
  /** Server-side latency in milliseconds, or `null` when not reported. */
  latencyMs: number | null;
}

/** Technical diagnostics for the most recent agent response, shown behind "technical details". */
export interface AIInsightsDiagnostics {
  /** Correlation id for tracing the request. */
  correlationId: string;
  /** ISO timestamp of the response. */
  timestamp: string;
  /** Server-side latency in milliseconds, or `null` when not reported. */
  latencyMs: number | null;
  /** Names of the tools the agent called. */
  toolsCalled: string[];
  /** Tool invocations performed while answering. */
  toolResults: AgentToolResult[];
  /** Raw backend error payload, when the request failed. */
  technicalDetails?: unknown;
}
