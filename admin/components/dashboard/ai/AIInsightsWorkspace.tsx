import { AnswerCanvas } from "@/components/dashboard/ai/AnswerCanvas";
import { IncidentTriageBanner } from "@/components/dashboard/ai/IncidentTriageBanner";
import { PromptComposer } from "@/components/dashboard/ai/PromptComposer";
import { ToolTimeline } from "@/components/dashboard/ai/ToolTimeline";
import {
  ClearSessionDialog,
  OperatingSignalsGrid,
  TemplateCardsGrid,
  WorkspaceControlTower,
} from "@/components/dashboard/ai/workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAIInsights } from "@/hooks/useAIInsights";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  History,
  ShieldCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

const SessionDrawer = dynamic(
  () =>
    import("@/components/dashboard/ai/SessionDrawer").then(
      (mod) => mod.SessionDrawer,
    ),
  { ssr: false },
);

const DiagnosticsDrawer = dynamic(
  () =>
    import("@/components/dashboard/ai/DiagnosticsDrawer").then(
      (mod) => mod.DiagnosticsDrawer,
    ),
  { ssr: false },
);

const SUGGESTED_PROMPTS = [
  "Analyze why yesterday's gross margin dipped and suggest actions.",
  "Find SKUs at risk of stockout in the next 14 days.",
  "Summarize top drivers behind return-rate increase this week.",
  "Recommend an upsell strategy for high-intent customer cohorts.",
];

export const AIInsightsWorkspace = () => {
  const prefersReducedMotion = useReducedMotion();
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const handoffAppliedRef = useRef(false);
  const router = useRouter();

  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false);
  const [diagnosticsDrawerOpen, setDiagnosticsDrawerOpen] = useState(false);

  const {
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
  } = useAIInsights();

  const sourceTitle = useMemo(() => {
    return typeof router.query.sourceTitle === "string"
      ? router.query.sourceTitle
      : "";
  }, [router.query.sourceTitle]);

  const sourcePath = useMemo(() => {
    return typeof router.query.sourcePath === "string"
      ? router.query.sourcePath
      : "";
  }, [router.query.sourcePath]);

  const prefillPrompt = useMemo(() => {
    return typeof router.query.prefill === "string" ? router.query.prefill : "";
  }, [router.query.prefill]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (!isModifier || event.key.toLowerCase() !== "k") {
        return;
      }

      event.preventDefault();
      promptRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (
      !router.isReady ||
      handoffAppliedRef.current ||
      !prefillPrompt ||
      prompt.trim().length > 0
    ) {
      return;
    }

    setPrompt(prefillPrompt);
    handoffAppliedRef.current = true;
  }, [prefillPrompt, prompt, router.isReady, setPrompt]);

  const staggerDelay = useMemo(() => {
    return prefersReducedMotion ? 0 : 0.06;
  }, [prefersReducedMotion]);

  const handleSelectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    promptRef.current?.focus();
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
      aria-label="AI Insights workspace"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_14%,hsla(23,83%,58%,0.18),transparent_38%),radial-gradient(circle_at_86%_6%,hsla(191,73%,56%,0.12),transparent_32%),radial-gradient(circle_at_50%_110%,hsla(35,74%,64%,0.1),transparent_34%),linear-gradient(165deg,hsl(210,18%,7%)_0%,hsl(210,18%,8.5%)_46%,hsl(210,18%,7%)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(hsla(34,18%,92%,0.06)_1px,transparent_1px),linear-gradient(90deg,hsla(34,18%,92%,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section
        className="relative z-10 mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-6 lg:px-8"
        aria-labelledby="ai-insights-title"
      >
        <motion.header
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-effect-strong border-gradient rounded-2xl p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                AI Insights
              </p>
              <h1
                id="ai-insights-title"
                className="text-gradient-royal mt-1 text-2xl font-semibold sm:text-3xl"
              >
                Decision Intelligence Workspace
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Ask context-rich questions, inspect tool traces, and preserve
                session continuity for reliable operational decisions.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                delay: prefersReducedMotion ? 0 : 0.08,
              }}
              className="flex flex-wrap items-center gap-2"
            >
              <Badge className="gradient-emerald text-white shadow-[0_10px_30px_hsla(152,34%,45%,0.22)]">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Authenticated BFF routing
              </Badge>
              <Badge className="gradient-purple text-white shadow-[0_10px_30px_hsla(23,83%,58%,0.22)]">
                <BrainCircuit className="size-3.5" aria-hidden="true" />
                Session: {sessionId.slice(0, 16)}
              </Badge>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSessionDrawerOpen(true)}
                className="h-9 rounded-xl border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.09]"
              >
                <History className="size-4" aria-hidden="true" />
                Session
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDiagnosticsDrawerOpen(true)}
                className="h-9 rounded-xl border-white/15 bg-white/[0.04] text-foreground hover:bg-white/[0.09]"
              >
                <Activity className="size-4" aria-hidden="true" />
                Diagnostics
              </Button>
            </motion.div>
          </div>
          {sourceTitle ? (
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.26,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[hsla(191,73%,56%,0.24)] bg-[hsla(191,73%,56%,0.09)] px-4 py-3"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(191,73%,76%)]">
                  Context Handoff
                </p>
                <p className="mt-1 text-sm text-[hsl(191,73%,88%)]">
                  Picked up your working context from{" "}
                  <span className="font-semibold">{sourceTitle}</span>. Continue
                  here for deeper analysis, diagnostics, and reusable prompts.
                </p>
              </div>
              {sourcePath ? (
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-9 rounded-xl border-[hsla(191,73%,56%,0.3)] bg-transparent text-[hsl(191,73%,82%)] hover:bg-[hsla(191,73%,56%,0.12)]"
                >
                  <Link href={sourcePath}>
                    Back to page
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </motion.div>
          ) : null}
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-5"
        >
          <IncidentTriageBanner />
        </motion.section>

        <OperatingSignalsGrid
          historyCount={history.length}
          savedPromptsCount={savedPrompts.length}
          toolsCount={tools.length}
          sourceTitle={sourceTitle}
          latencyMs={diagnostics?.latencyMs}
          prefersReducedMotion={prefersReducedMotion}
          staggerDelay={staggerDelay}
        />

        <TemplateCardsGrid
          onSelectPrompt={handleSelectTemplate}
          prefersReducedMotion={prefersReducedMotion}
          staggerDelay={staggerDelay}
        />

        <motion.section
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: staggerDelay }}
          className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]"
        >
          <PromptComposer
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={() => submitPrompt()}
            onClear={clearPrompt}
            onSavePrompt={savePrompt}
            canSubmit={canSubmit}
            pending={lifecycle === "loading"}
            validationMessage={promptValidationMessage}
            promptRef={promptRef}
            maxPromptLength={maxPromptLength}
            recentPrompts={recentPrompts}
            onUseRecentPrompt={setPrompt}
            suggestedPrompts={SUGGESTED_PROMPTS}
          />

          <WorkspaceControlTower
            savedPrompts={savedPrompts}
            onUsePrompt={handleSelectTemplate}
            onOpenClearDialog={() => setIsClearDialogOpen(true)}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: staggerDelay * 2 }}
          className="mt-5 grid gap-4 xl:grid-cols-[1.6fr_1fr]"
        >
          <AnswerCanvas
            lifecycle={lifecycle}
            answer={responseText}
            errorMessage={friendlyError}
            diagnostics={diagnostics}
            technicalError={technicalError}
            showTechnicalDetails={showTechnicalDetails}
            onToggleTechnicalDetails={toggleTechnicalDetails}
            onRetry={retry}
          />

          <ToolTimeline
            toolResults={diagnostics?.toolResults ?? []}
            toolsCalled={diagnostics?.toolsCalled ?? []}
          />
        </motion.section>
      </section>

      <SessionDrawer
        open={sessionDrawerOpen}
        onOpenChange={setSessionDrawerOpen}
        history={history}
        savedPrompts={savedPrompts}
        onUsePrompt={(value) => {
          setPrompt(value);
          setSessionDrawerOpen(false);
          promptRef.current?.focus();
        }}
        onRemoveSavedPrompt={removeSavedPrompt}
      />

      <DiagnosticsDrawer
        open={diagnosticsDrawerOpen}
        onOpenChange={setDiagnosticsDrawerOpen}
        diagnostics={diagnostics}
        tools={tools}
      />

      <ClearSessionDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onConfirmClear={clearSession}
      />
    </main>
  );
};
