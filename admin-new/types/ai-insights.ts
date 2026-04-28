export interface AgentQueryRequest {
  session_id: string;
  prompt: string;
}

export interface AgentToolResult {
  id?: string;
  tool?: string;
  name?: string;
  success?: boolean;
  status?: "success" | "error" | "partial";
  duration_ms?: number;
  started_at?: string;
  finished_at?: string;
  input?: unknown;
  output?: unknown;
  error?: string;
  [key: string]: unknown;
}

export interface AgentQueryResponseRaw {
  success?: boolean;
  answer?: string;
  response?: string;
  message?: string;
  tool_results?: AgentToolResult[];
  tools_called?: string[];
  correlation_id?: string;
  timestamp?: string;
  latency_ms?: number;
  session_id?: string;
  error?: unknown;
  [key: string]: unknown;
}

export interface AgentQueryResult {
  success: boolean;
  answer: string;
  sessionId: string;
  toolResults: AgentToolResult[];
  toolsCalled: string[];
  correlationId: string;
  timestamp: string;
  latencyMs: number | null;
  partialSuccess: boolean;
  technicalDetails?: unknown;
}

export interface AgentSessionMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  correlation_id?: string;
}

export interface AgentSessionResponseRaw {
  success?: boolean;
  session_id?: string;
  messages?: AgentSessionMessage[];
  history?: AgentSessionMessage[];
  data?: {
    messages?: AgentSessionMessage[];
    history?: AgentSessionMessage[];
  };
  [key: string]: unknown;
}

export interface AgentToolDefinition {
  id?: string;
  name: string;
  description?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

export interface AgentToolsResponseRaw {
  tools?: AgentToolDefinition[];
  data?: {
    tools?: AgentToolDefinition[];
  };
  [key: string]: unknown;
}

export type RequestLifecycle =
  | "idle"
  | "bootstrapping"
  | "loading"
  | "success"
  | "error"
  | "partial";

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  answer: string;
  createdAt: string;
  correlationId: string;
  latencyMs: number | null;
}

export interface AIInsightsDiagnostics {
  correlationId: string;
  timestamp: string;
  latencyMs: number | null;
  toolsCalled: string[];
  toolResults: AgentToolResult[];
  technicalDetails?: unknown;
}
