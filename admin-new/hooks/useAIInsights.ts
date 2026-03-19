import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  clearAgentSession,
  extractTechnicalDetails,
  fetchAgentTools,
  fetchSessionHistory,
  queryAgent,
  toFriendlyErrorMessage,
} from "@/lib/ai-insights-api";
import { trackAIInsightsEvent } from "@/lib/ai-insights-analytics";
import {
  AIInsightsDiagnostics,
  AgentSessionMessage,
  AgentToolDefinition,
  PromptHistoryItem,
  RequestLifecycle,
} from "@/types/ai-insights";

const DEFAULT_MAX_PROMPT_LENGTH = 3000;
const RECENT_PROMPTS_LIMIT = 8;
const SAVED_PROMPTS_LIMIT = 16;

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

const asString = (value: unknown): string | null => {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

const parseMaybeArray = <T>(value: string | null): T[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const createSessionId = () => {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `ai-${Date.now()}-${random}`;
};

const deriveIdentityFromStatus = (raw: unknown): string => {
  const data = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const nested =
    typeof data.data === "object" && data.data !== null ? (data.data as Record<string, unknown>) : data;
  const user =
    typeof nested.user === "object" && nested.user !== null
      ? (nested.user as Record<string, unknown>)
      : nested;

  const candidates = [user.id, user._id, user.userId, user.email, nested.id, nested.userId, data.id];

  for (const value of candidates) {
    const next = asString(value);
    if (next) {
      return next;
    }
  }

  return "admin";
};

const formatHistoryFromMessages = (
  messages: AgentSessionMessage[],
): PromptHistoryItem[] => {
  const items: PromptHistoryItem[] = [];
  let pendingUserPrompt: AgentSessionMessage | null = null;

  messages.forEach((message) => {
    if (message.role === "user") {
      pendingUserPrompt = message;
      return;
    }

    if (message.role !== "assistant" || !pendingUserPrompt) {
      return;
    }

    const idSource = `${pendingUserPrompt.content}-${message.content}-${message.timestamp || ""}`;
    items.push({
      id: idSource,
      prompt: pendingUserPrompt.content,
      answer: message.content,
      createdAt: message.timestamp || pendingUserPrompt.timestamp || new Date().toISOString(),
      correlationId: message.correlation_id || "",
      latencyMs: null,
    });

    pendingUserPrompt = null;
  });

  return items.slice(-RECENT_PROMPTS_LIMIT).reverse();
};

interface UseAIInsightsOptions {
  maxPromptLength?: number;
}

export const useAIInsights = (options: UseAIInsightsOptions = {}) => {
  const maxPromptLength = options.maxPromptLength ?? DEFAULT_MAX_PROMPT_LENGTH;
  const [lifecycle, setLifecycle] = useState<RequestLifecycle>("bootstrapping");
  const [sessionId, setSessionId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [technicalError, setTechnicalError] = useState<unknown>(null);
  const [diagnostics, setDiagnostics] = useState<AIInsightsDiagnostics | null>(null);
  const [tools, setTools] = useState<AgentToolDefinition[]>([]);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [storageKeys, setStorageKeys] = useState({
    session: "ai-insights:session:admin",
    recent: "ai-insights:recent:admin",
    saved: "ai-insights:saved:admin",
  });

  const lastPromptRef = useRef("");

  const canSubmit = useMemo(() => {
    const trimmed = prompt.trim();
    return trimmed.length > 0 && trimmed.length <= maxPromptLength && lifecycle !== "loading";
  }, [lifecycle, maxPromptLength, prompt]);

  const promptValidationMessage = useMemo(() => {
    if (prompt.trim().length === 0) {
      return "Enter a prompt to continue.";
    }
    if (prompt.length > maxPromptLength) {
      return `Prompt must be ${maxPromptLength} characters or fewer.`;
    }
    return null;
  }, [maxPromptLength, prompt]);

  const persistArray = useCallback((key: string, value: string[]) => {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(key, JSON.stringify(value));
  }, []);

  const createStorageKeys = useCallback((identity: string) => {
    const safeIdentity = identity.replace(/[^a-zA-Z0-9_-]/g, "_");
    return {
      session: `ai-insights:session:${safeIdentity}`,
      recent: `ai-insights:recent:${safeIdentity}`,
      saved: `ai-insights:saved:${safeIdentity}`,
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      setLifecycle("bootstrapping");
      try {
        const [toolsResult, statusResult] = await Promise.allSettled([
          fetchAgentTools(),
          axios.get("/api/auth/status", {
            withCredentials: true,
            timeout: 6000,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        if (toolsResult.status === "fulfilled") {
          setTools(toolsResult.value);
        }

        const identity =
          statusResult.status === "fulfilled"
            ? deriveIdentityFromStatus(statusResult.value.data)
            : "admin";

        const keys = createStorageKeys(identity);
        setStorageKeys(keys);
        const storage = getStorage();

        const storedSessionId = storage?.getItem(keys.session) ?? "";
        const activeSessionId = storedSessionId || createSessionId();

        if (!storedSessionId) {
          storage?.setItem(keys.session, activeSessionId);
        }

        setSessionId(activeSessionId);
        const recent = parseMaybeArray<string>(storage?.getItem(keys.recent) ?? null).slice(
          0,
          RECENT_PROMPTS_LIMIT,
        );
        const saved = parseMaybeArray<string>(storage?.getItem(keys.saved) ?? null).slice(
          0,
          SAVED_PROMPTS_LIMIT,
        );

        setRecentPrompts(recent);
        setSavedPrompts(saved);

        try {
          const messages = await fetchSessionHistory(activeSessionId);
          if (!isMounted) {
            return;
          }
          const historyFromSession = formatHistoryFromMessages(messages);
          setHistory(historyFromSession);
        } catch {
          setHistory([]);
        }

        setLifecycle("idle");
      } catch {
        if (!isMounted) {
          return;
        }
        setLifecycle("idle");
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [createStorageKeys]);

  const updatePromptCollections = useCallback(
    (nextPrompt: string) => {
      const trimmed = nextPrompt.trim();
      if (!trimmed) {
        return;
      }

      setRecentPrompts((previous) => {
        const next = [trimmed, ...previous.filter((item) => item !== trimmed)].slice(0, RECENT_PROMPTS_LIMIT);
        persistArray(storageKeys.recent, next);
        return next;
      });
    },
    [persistArray, storageKeys.recent],
  );

  const submitPrompt = useCallback(
    async (value?: string) => {
      const nextPrompt = (value ?? prompt).trim();
      if (!nextPrompt || nextPrompt.length > maxPromptLength || lifecycle === "loading") {
        return;
      }

      setFriendlyError(null);
      setTechnicalError(null);
      setLifecycle("loading");
      lastPromptRef.current = nextPrompt;
      trackAIInsightsEvent("prompt_submitted", { promptLength: nextPrompt.length });

      try {
        const result = await queryAgent({
          session_id: sessionId,
          prompt: nextPrompt,
        });

        setResponseText(result.answer);
        setSessionId(result.sessionId);
        setDiagnostics({
          correlationId: result.correlationId,
          timestamp: result.timestamp,
          latencyMs: result.latencyMs,
          toolsCalled: result.toolsCalled,
          toolResults: result.toolResults,
          technicalDetails: result.technicalDetails,
        });

        const historyItem: PromptHistoryItem = {
          id: `${Date.now()}-${result.correlationId || Math.random().toString(36).slice(2, 8)}`,
          prompt: nextPrompt,
          answer: result.answer,
          createdAt: result.timestamp,
          correlationId: result.correlationId,
          latencyMs: result.latencyMs,
        };

        setHistory((previous) => [historyItem, ...previous].slice(0, RECENT_PROMPTS_LIMIT));
        updatePromptCollections(nextPrompt);

        setLifecycle(result.partialSuccess ? "partial" : "success");
        trackAIInsightsEvent("response_succeeded", {
          partialSuccess: result.partialSuccess,
          toolsCalled: result.toolsCalled.length,
        });
      } catch (error) {
        const friendly = toFriendlyErrorMessage(error);
        const technical = extractTechnicalDetails(error);

        setFriendlyError(friendly);
        setTechnicalError(technical);
        setLifecycle("error");
        trackAIInsightsEvent("response_failed", { reason: friendly });
      }
    },
    [lifecycle, maxPromptLength, prompt, sessionId, updatePromptCollections],
  );

  const retry = useCallback(async () => {
    if (!lastPromptRef.current) {
      return;
    }
    trackAIInsightsEvent("retry_clicked", {});
    await submitPrompt(lastPromptRef.current);
  }, [submitPrompt]);

  const clearPrompt = useCallback(() => {
    setPrompt("");
  }, []);

  const clearSession = useCallback(async () => {
    if (!sessionId) {
      return;
    }

    try {
      await clearAgentSession(sessionId);
    } catch {
      // The local reset should still proceed if backend clear fails.
    }

    const newSessionId = createSessionId();
    const storage = getStorage();
    storage?.setItem(storageKeys.session, newSessionId);

    setSessionId(newSessionId);
    setResponseText("");
    setFriendlyError(null);
    setTechnicalError(null);
    setDiagnostics(null);
    setHistory([]);
    setLifecycle("idle");
    setIsClearDialogOpen(false);
  }, [sessionId, storageKeys.session]);

  const savePrompt = useCallback(() => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }

    setSavedPrompts((previous) => {
      const next = [trimmed, ...previous.filter((item) => item !== trimmed)].slice(0, SAVED_PROMPTS_LIMIT);
      persistArray(storageKeys.saved, next);
      return next;
    });
  }, [persistArray, prompt, storageKeys.saved]);

  const removeSavedPrompt = useCallback(
    (value: string) => {
      setSavedPrompts((previous) => {
        const next = previous.filter((promptItem) => promptItem !== value);
        persistArray(storageKeys.saved, next);
        return next;
      });
    },
    [persistArray, storageKeys.saved],
  );

  const toggleTechnicalDetails = useCallback(() => {
    setShowTechnicalDetails((previous) => {
      const next = !previous;
      trackAIInsightsEvent("details_toggled", { visible: next });
      return next;
    });
  }, []);

  return {
    lifecycle,
    sessionId,
    prompt,
    setPrompt,
    responseText,
    diagnostics,
    tools,
    history,
    recentPrompts,
    savedPrompts,
    friendlyError,
    technicalError,
    showTechnicalDetails,
    isClearDialogOpen,
    setIsClearDialogOpen,
    canSubmit,
    promptValidationMessage,
    submitPrompt,
    retry,
    clearPrompt,
    clearSession,
    savePrompt,
    removeSavedPrompt,
    toggleTechnicalDetails,
    maxPromptLength,
  };
};
