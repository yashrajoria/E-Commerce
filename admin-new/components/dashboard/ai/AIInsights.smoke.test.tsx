import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PromptComposer } from "@/components/dashboard/ai/PromptComposer";
import { AnswerCanvas } from "@/components/dashboard/ai/AnswerCanvas";
import { ToolTimeline } from "@/components/dashboard/ai/ToolTimeline";
import { AIInsightsWorkspace } from "@/components/dashboard/ai/AIInsightsWorkspace";
import { useAIInsights } from "@/hooks/useAIInsights";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
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
