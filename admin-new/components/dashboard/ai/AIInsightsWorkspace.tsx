import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  History,
  Activity,
  Sparkles,
  Trash2,
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

  const staggerDelay = useMemo(() => {
    return prefersReducedMotion ? 0 : 0.06;
  }, [prefersReducedMotion]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground" aria-label="AI Insights workspace">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_14%,hsla(263,70%,58%,0.22),transparent_38%),radial-gradient(circle_at_86%_6%,hsla(160,84%,39%,0.14),transparent_32%),radial-gradient(circle_at_50%_110%,hsla(43,96%,56%,0.1),transparent_34%),linear-gradient(165deg,hsl(240,15%,4.5%)_0%,hsl(240,16%,6%)_46%,hsl(240,15%,4.5%)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(hsla(240,10%,96%,0.08)_1px,transparent_1px),linear-gradient(90deg,hsla(240,10%,96%,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

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
              <Badge className="gradient-emerald text-white shadow-[0_10px_30px_hsla(160,84%,39%,0.25)]">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Authenticated BFF routing
              </Badge>
              <Badge className="gradient-purple text-white shadow-[0_10px_30px_hsla(263,70%,58%,0.25)]">
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
        </motion.header>

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

          <aside className="glass-effect rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Quick Templates
            </p>
            <div className="mt-3 space-y-2">
              {templateCards.map((template, index) => (
                <motion.button
                  key={template.title}
                  type="button"
                  onClick={() => setPrompt(template.prompt)}
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.24,
                    delay: prefersReducedMotion ? 0 : 0.1 + index * 0.05,
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -2, scale: 1.01 }
                  }
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[hsla(263,70%,58%,0.4)] hover:bg-white/[0.07]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-[hsl(43,96%,56%)]" aria-hidden="true" />
                    <p className="text-sm font-semibold text-foreground">{template.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                </motion.button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(43,96%,56%,0.35)] bg-[hsla(43,96%,56%,0.08)] p-3">
              <p className="text-xs text-[hsl(43,96%,84%)]">
                Need a fresh session context? Clear current session to start a new trace.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsClearDialogOpen(true)}
                className="mt-2 h-8 rounded-lg border-[hsla(43,96%,56%,0.45)] bg-transparent text-[hsl(43,96%,84%)] hover:bg-[hsla(43,96%,56%,0.16)]"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Clear Session
              </Button>
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
