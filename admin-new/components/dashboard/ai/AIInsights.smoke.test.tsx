import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PromptComposer } from "@/components/dashboard/ai/PromptComposer";
import { AnswerCanvas } from "@/components/dashboard/ai/AnswerCanvas";
import { ToolTimeline } from "@/components/dashboard/ai/ToolTimeline";
import { AIInsightsWorkspace } from "@/components/dashboard/ai/AIInsightsWorkspace";
import { ContextualAIAssistant } from "@/components/ai/ContextualAIAssistant";
import { useAIInsights } from "@/hooks/useAIInsights";
import {
  buildContextualPrompt,
  resolveAIPageContext,
} from "@/lib/ai-contextual-assistant";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a href={typeof href === "string" ? href : "#"}>{children}</a>
  ),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    isReady: true,
    query: {},
  }),
}));

vi.mock("@/hooks/useAIInsights", () => ({
  useAIInsights: vi.fn(),
}));

describe("AI Insights smoke flows", () => {
  it("submits prompt from composer", () => {
    const onSubmit = vi.fn();
    const onPromptChange = vi.fn();

    render(
      <PromptComposer
        prompt="Find demand anomalies"
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        onClear={vi.fn()}
        onSavePrompt={vi.fn()}
        canSubmit={true}
        pending={false}
        validationMessage={null}
        promptRef={{ current: null }}
        maxPromptLength={3000}
        recentPrompts={[]}
        onUseRecentPrompt={vi.fn()}
        suggestedPrompts={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows error state and allows retry action", () => {
    const onRetry = vi.fn();

    render(
      <AnswerCanvas
        lifecycle="error"
        answer=""
        errorMessage="The AI service is temporarily unavailable."
        diagnostics={null}
        technicalError={{ status: 503 }}
        showTechnicalDetails={false}
        onToggleTechnicalDetails={vi.fn()}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText(/request could not be completed/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders tool details timeline", () => {
    render(
      <ToolTimeline
        toolsCalled={["inventory.lookup"]}
        toolResults={[
          {
            tool: "inventory.lookup",
            success: true,
            duration_ms: 42,
            output: { sku: "A-123", stock: 18 },
          },
        ]}
      />,
    );

    expect(screen.getByText(/tool execution timeline/i)).toBeInTheDocument();
    expect(screen.getAllByText(/inventory.lookup/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/view output/i)).toBeInTheDocument();
  });

  it("runs a contextual quick task from the floating assistant", () => {
    const submitPrompt = vi.fn();

    vi.mocked(useAIInsights).mockReturnValue({
      lifecycle: "idle",
      sessionId: "ai-page-orders",
      prompt: "",
      setPrompt: vi.fn(),
      responseText: "",
      diagnostics: null,
      tools: [],
      history: [],
      recentPrompts: [],
      savedPrompts: [],
      friendlyError: null,
      technicalError: null,
      showTechnicalDetails: false,
      isClearDialogOpen: false,
      setIsClearDialogOpen: vi.fn(),
      canSubmit: true,
      promptValidationMessage: null,
      submitPrompt,
      retry: vi.fn(),
      clearPrompt: vi.fn(),
      clearSession: vi.fn(),
      savePrompt: vi.fn(),
      removeSavedPrompt: vi.fn(),
      toggleTechnicalDetails: vi.fn(),
      maxPromptLength: 1200,
    });

    render(
      <ContextualAIAssistant
        context={{
          key: "orders-list",
          title: "Orders",
          summary: "Operational orders queue with filters and status tracking.",
          placeholder: "Ask about the current orders queue...",
          focusAreas: ["Pending backlog", "Fulfillment bottlenecks"],
          sessionNamespace: "page-orders",
          route: "/orders",
          quickActions: [
            {
              id: "orders-backlog",
              label: "Review backlog",
              description: "Pinpoint where the queue is piling up.",
              prompt: "Analyze the current orders page and identify the biggest backlog or delay patterns by status.",
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /open ai assistant for orders/i }));
    fireEvent.click(screen.getByRole("button", { name: /review backlog/i }));
    expect(submitPrompt).toHaveBeenCalledWith(
      "Analyze the current orders page and identify the biggest backlog or delay patterns by status.",
    );
  });

  it("resolves route context and builds a contextual prompt envelope", () => {
    const context = resolveAIPageContext({
      pathname: "/orders/[id]",
      asPath: "/orders/ord_12345?tab=timeline",
      query: { id: "ord_12345" },
    });

    expect(context?.title).toContain("Order");
    expect(context?.sessionNamespace).toContain("ord_12345");

    const prompt = buildContextualPrompt(
      context!,
      "What should I do next on this order?",
    );

    expect(prompt).toContain("[SHOPSWIFT_CONTEXT]");
    expect(prompt).toContain("page_key=order-details");
    expect(prompt).toContain("User request: What should I do next on this order?");
  });

  it("executes confirmed session clear flow", () => {
    const clearSession = vi.fn();

    vi.mocked(useAIInsights).mockReturnValue({
      lifecycle: "idle",
      sessionId: "ai-session-1",
      prompt: "",
      setPrompt: vi.fn(),
      responseText: "",
      diagnostics: null,
      tools: [],
      history: [],
      recentPrompts: [],
      savedPrompts: [],
      friendlyError: null,
      technicalError: null,
      showTechnicalDetails: false,
      isClearDialogOpen: true,
      setIsClearDialogOpen: vi.fn(),
      canSubmit: false,
      promptValidationMessage: "Enter a prompt to continue.",
      submitPrompt: vi.fn(),
      retry: vi.fn(),
      clearPrompt: vi.fn(),
      clearSession,
      savePrompt: vi.fn(),
      removeSavedPrompt: vi.fn(),
      toggleTechnicalDetails: vi.fn(),
      maxPromptLength: 3000,
    });

    render(<AIInsightsWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: /confirm clear/i }));
    expect(clearSession).toHaveBeenCalledTimes(1);
  });
});
