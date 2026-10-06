export type AIInsightsEventName =
  | "prompt_submitted"
  | "response_succeeded"
  | "response_failed"
  | "retry_clicked"
  | "details_toggled";

interface AnalyticsPayload {
  [key: string]: unknown;
}

export const trackAIInsightsEvent = (
  event: AIInsightsEventName,
  payload: AnalyticsPayload = {},
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const detail = {
    event,
    payload,
    ts: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("ai-insights:event", { detail }));

  if (process.env.NODE_ENV !== "production") {
    console.debug("[ai-insights]", detail);
  }
};
