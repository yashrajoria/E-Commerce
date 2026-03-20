import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  ShieldCheck,
  History,
  Activity,
  Sparkles,
  Trash2,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAIInsights } from "@/hooks/useAIInsights";
import { PromptComposer } from "@/components/dashboard/ai/PromptComposer";
import { AnswerCanvas } from "@/components/dashboard/ai/AnswerCanvas";
import { ToolTimeline } from "@/components/dashboard/ai/ToolTimeline";

const SessionDrawer = dynamic(
  () => import("@/components/dashboard/ai/SessionDrawer").then((mod) => mod.SessionDrawer),
  { ssr: false },
);

const DiagnosticsDrawer = dynamic(
  () => import("@/components/dashboard/ai/DiagnosticsDrawer").then((mod) => mod.DiagnosticsDrawer),
  { ssr: false },
);

const SUGGESTED_PROMPTS = [
  "Analyze why yesterday's gross margin dipped and suggest actions.",
  "Find SKUs at risk of stockout in the next 14 days.",
  "Summarize top drivers behind return-rate increase this week.",
  "Recommend an upsell strategy for high-intent customer cohorts.",
];

const templateCards = [
  {
    title: "Revenue Pulse",
    description: "Track unusual swings by category and location with recommended interventions.",
    prompt: "Highlight unusual revenue swings by category, city, and channel in the last 7 days.",
  },
  {
    title: "Return Risk",
    description: "Surface return hotspots and propose policy and fulfillment changes.",
    prompt: "Identify return hotspots by SKU and reason-code with corrective actions.",
  },
  {
    title: "Campaign Impact",
    description: "Map campaign influence to conversion quality and margin outcomes.",
    prompt: "Evaluate campaign performance vs margin contribution and suggest reallocation.",
  },
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

  const operatingSignals = useMemo(
    () => [
      {
        label: "Session Memory",
        value: history.length,
        detail: history.length
          ? "Previous exchanges ready for follow-up"
          : "Fresh workspace context",
        icon: History,
      },
      {
        label: "Prompt Library",
        value: savedPrompts.length,
        detail: savedPrompts.length
          ? "Reusable prompts saved for later"
          : "Save your strongest prompts",
        icon: Sparkles,
      },
      {
        label: "Tool Readiness",
        value: tools.length,
        detail: tools.length
          ? "Available tool definitions loaded"
          : "Awaiting tool catalog",
        icon: BrainCircuit,
      },
      {
        label: sourceTitle ? "Context Handoff" : "Response Speed",
        value: sourceTitle || (diagnostics?.latencyMs ? `${diagnostics.latencyMs}ms` : "Live"),
        detail: sourceTitle
          ? `Jumped in from ${sourceTitle}`
          : "Latency and tool traces stay visible",
        icon: sourceTitle ? ArrowUpRight : Clock3,
      },
    ],
    [diagnostics?.latencyMs, history.length, savedPrompts.length, sourceTitle, tools.length],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground" aria-label="AI Insights workspace">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_14%,hsla(23,83%,58%,0.18),transparent_38%),radial-gradient(circle_at_86%_6%,hsla(191,73%,56%,0.12),transparent_32%),radial-gradient(circle_at_50%_110%,hsla(35,74%,64%,0.1),transparent_34%),linear-gradient(165deg,hsl(210,18%,7%)_0%,hsl(210,18%,8.5%)_46%,hsl(210,18%,7%)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(hsla(34,18%,92%,0.06)_1px,transparent_1px),linear-gradient(90deg,hsla(34,18%,92%,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative z-10 mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-6 lg:px-8" aria-labelledby="ai-insights-title">
        <motion.header
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-effect-strong border-gradient rounded-2xl p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">AI Insights</p>
              <h1 id="ai-insights-title" className="text-gradient-royal mt-1 text-2xl font-semibold sm:text-3xl">
                Decision Intelligence Workspace
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Ask context-rich questions, inspect tool traces, and preserve session continuity for reliable operational decisions.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: prefersReducedMotion ? 0 : 0.08 }}
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
              transition={{ duration: 0.26, delay: prefersReducedMotion ? 0 : 0.1 }}
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[hsla(191,73%,56%,0.24)] bg-[hsla(191,73%,56%,0.09)] px-4 py-3"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(191,73%,76%)]">
                  Context Handoff
                </p>
                <p className="mt-1 text-sm text-[hsl(191,73%,88%)]">
                  Picked up your working context from <span className="font-semibold">{sourceTitle}</span>. Continue here for deeper analysis, diagnostics, and reusable prompts.
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
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: staggerDelay * 0.8 }}
          className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {operatingSignals.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: prefersReducedMotion ? 0 : 0.05 + index * 0.04 }}
                className="glass-effect rounded-2xl border border-white/8 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.06] text-[hsl(35,74%,64%)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: staggerDelay }}
          className="mt-5 grid gap-3 xl:grid-cols-3"
        >
          {templateCards.map((template, index) => (
            <motion.button
              key={template.title}
              type="button"
              onClick={() => {
                setPrompt(template.prompt);
                promptRef.current?.focus();
              }}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: prefersReducedMotion ? 0 : 0.06 + index * 0.04 }}
              whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
              className="glass-effect rounded-[26px] border border-white/10 p-4 text-left transition hover:border-[hsla(23,83%,58%,0.3)] hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Workflow Lane
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {template.title}
                  </h3>
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.05] text-[hsl(35,74%,64%)]">
                  <Sparkles className="size-4" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {template.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-muted-foreground">
                  Autofill into composer
                </span>
                <span className="text-[hsl(191,73%,72%)]">Open lane</span>
              </div>
            </motion.button>
          ))}
        </motion.section>

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

          <aside className="glass-effect rounded-[28px] p-4 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Control Tower
            </p>
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="size-4 text-[hsl(23,83%,72%)]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">
                    Workspace Runbook
                  </p>
                </div>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>1. Pick a workflow lane or guided start.</p>
                  <p>2. Refine the brief in the command deck.</p>
                  <p>3. Validate the answer against traces and diagnostics.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-[hsl(191,73%,72%)]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">
                    Saved Prompt Vault
                  </p>
                </div>
                {savedPrompts.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Save the prompts you reuse most and they will appear here as one-click brief starters.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {savedPrompts.slice(0, 4).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setPrompt(item);
                          promptRef.current?.focus();
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[hsla(210,16%,10%,0.72)] px-3 py-2 text-left text-sm text-foreground transition hover:border-[hsla(191,73%,56%,0.3)] hover:text-[hsl(191,73%,72%)]"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[hsla(35,74%,64%,0.35)] bg-[hsla(35,74%,64%,0.08)] p-3">
                <p className="text-sm font-semibold text-[hsl(35,74%,84%)]">
                  Reset session context
                </p>
                <p className="mt-1 text-xs leading-5 text-[hsl(35,74%,84%)]">
                  Clear the current thread when you want the next answer to start from a clean analytical baseline.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClearDialogOpen(true)}
                  className="mt-3 h-9 rounded-xl border-[hsla(35,74%,64%,0.42)] bg-transparent text-[hsl(35,74%,84%)] hover:bg-[hsla(35,74%,64%,0.14)]"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Clear Session
                </Button>
              </div>
            </div>
          </aside>
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

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="glass-effect-strong border-white/15 text-foreground">
          <DialogHeader>
            <DialogTitle>Clear AI session?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This resets active conversation context and local history pointers for this admin account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearDialogOpen(false)}
              className="rounded-xl border-white/20 bg-white/[0.04] text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={clearSession}
              className="rounded-xl gradient-amber text-[hsl(38,92%,12%)] hover:opacity-90"
            >
              Confirm clear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};
