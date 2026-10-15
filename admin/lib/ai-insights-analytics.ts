/** Names of the client-side analytics events emitted by the AI Insights surfaces. */
export type AIInsightsEventName =
  | "prompt_submitted"
  | "response_succeeded"
  | "response_failed"
  | "retry_clicked"
  | "details_toggled";

interface AnalyticsPayload {
  [key: string]: unknown;
}

/**
 * Emits an AI Insights analytics event on the `ai-insights:event` window event.
 *
 * @remarks
 * No-op during SSR. Logs to the console outside production. Consumers listen via
 * `window.addEventListener("ai-insights:event", ...)`.
 *
 * @param event - The event name to record.
 * @param payload - Arbitrary event metadata; defaults to an empty object.
 * @returns Nothing; the event is dispatched as a browser `CustomEvent`.
 */
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
