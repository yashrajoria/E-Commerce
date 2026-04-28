import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  Copy,
  AlertTriangle,
  RefreshCw,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIInsightsDiagnostics, RequestLifecycle } from "@/types/ai-insights";

interface AnswerCanvasProps {
  lifecycle: RequestLifecycle;
  answer: string;
  errorMessage: string | null;
  diagnostics: AIInsightsDiagnostics | null;
  technicalError: unknown;
  showTechnicalDetails: boolean;
  onToggleTechnicalDetails: () => void;
  onRetry: () => void;
}

const formatLatency = (latencyMs: number | null) => {
  if (typeof latencyMs !== "number") {
    return "-";
  }
  if (latencyMs < 1000) {
    return `${latencyMs} ms`;
  }
  return `${(latencyMs / 1000).toFixed(2)} s`;
};

export const AnswerCanvas = ({
  lifecycle,
  answer,
  errorMessage,
  diagnostics,
  technicalError,
  showTechnicalDetails,
  onToggleTechnicalDetails,
  onRetry,
}: AnswerCanvasProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [answerCopied, setAnswerCopied] = useState(false);

  const technicalDetails = useMemo(() => {
    if (diagnostics?.technicalDetails) {
      return diagnostics.technicalDetails;
    }
    return technicalError;
  }, [diagnostics?.technicalDetails, technicalError]);

  const technicalDetailsText = useMemo(() => {
    if (typeof technicalDetails === "undefined") {
      return "";
    }
    return JSON.stringify(technicalDetails, null, 2);
  }, [technicalDetails]);

  const copyCorrelationId = async () => {
    if (!diagnostics?.correlationId || typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(diagnostics.correlationId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const copyAnswer = async () => {
    if (!answer || typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(answer);
    setAnswerCopied(true);
    window.setTimeout(() => setAnswerCopied(false), 1200);
  };

  const toolCount = diagnostics?.toolsCalled?.length ?? 0;

  return (
    <AnimatePresence mode="wait">
      {lifecycle === "loading" && (
        <motion.section
          key="loading"
          aria-label="AI response loading"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
          transition={{ duration: 0.2 }}
          className="glass-effect border-gradient space-y-4 rounded-[28px] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.06] text-[hsl(35,74%,66%)]">
              <Bot className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                AI answer canvas
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                Building your operator brief
              </h3>
            </div>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-[hsla(240,14%,6%,0.7)] p-4">
            {[
              "Parsing the question and preserving session context",
              "Calling the right tools and reconciling evidence",
              "Drafting a concise action-oriented answer",
            ].map((item) => (
              <div key={item} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{item}</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Active
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[hsl(23,83%,58%)] to-[hsl(191,73%,56%)]" />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {lifecycle === "error" && (
        <motion.section
          key="error"
          aria-live="polite"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
          transition={{ duration: 0.22 }}
          className="rounded-2xl border border-[hsla(35,74%,64%,0.35)] bg-[hsla(35,74%,64%,0.1)] p-5 text-[hsl(35,74%,92%)]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-[hsl(35,74%,70%)]" aria-hidden="true" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Request could not be completed</h3>
              <p className="text-sm text-[hsl(35,74%,86%)]">
                {errorMessage || "Something went wrong while generating insights."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={onRetry}
                  className="h-9 rounded-xl gradient-amber text-[hsl(38,92%,12%)] hover:opacity-95"
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Retry
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onToggleTechnicalDetails}
                  className="h-9 rounded-xl border-white/25 bg-transparent text-foreground hover:bg-white/[0.08]"
                >
                  {showTechnicalDetails ? "Hide technical details" : "Show technical details"}
                </Button>
              </div>
              {showTechnicalDetails && technicalDetailsText.length > 0 && (
                <pre className="max-h-56 overflow-auto rounded-xl bg-[hsla(240,15%,4.5%,0.82)] p-3 text-xs text-foreground">
                  {technicalDetailsText}
                </pre>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {lifecycle !== "loading" && lifecycle !== "error" && !answer && (
        <motion.section
          key="empty"
          aria-label="AI empty state"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
          transition={{ duration: 0.22 }}
          className="glass-effect rounded-[28px] p-6"
        >
          <h3 className="text-gradient text-lg font-semibold">AI answer canvas</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask a question to generate actionable insights with tool-backed evidence.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-foreground">Ask for a decision</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the workspace for an answer that ends in next actions, not just description.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-foreground">Inspect the evidence</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tool traces and diagnostics stay visible beside the answer instead of buried in a modal.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-foreground">Keep continuity</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent prompts and saved lines let you revisit a thread without rebuilding context.
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {lifecycle !== "loading" && lifecycle !== "error" && !!answer && (
        <motion.section
          key="answer"
          aria-label="AI response"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
          transition={{ duration: 0.24 }}
          className="glass-effect border-gradient rounded-[28px] p-5"
        >
          <div className="mb-5 flex flex-wrap items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.06] text-[hsl(35,74%,66%)]">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Operator Brief
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">
                Primary answer
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gradient-emerald text-white">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {lifecycle === "partial" ? "Partial Success" : "Success"}
              </Badge>
              {lifecycle === "partial" ? (
                <Badge className="bg-[hsla(35,74%,64%,0.2)] text-[hsl(35,74%,80%)]">
                  Some tools failed
                </Badge>
              ) : null}
              {toolCount > 0 ? (
                <Badge
                  variant="outline"
                  className="border-white/15 bg-white/[0.04] text-foreground"
                >
                  {toolCount} tool{toolCount === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,hsla(240,14%,7%,0.88),hsla(240,14%,5%,0.72))] p-5 shadow-[inset_0_1px_0_hsla(0,0%,100%,0.05)]">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {answer}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={copyAnswer}
              className="h-9 rounded-xl border-white/15 bg-white/[0.03] text-foreground hover:bg-white/[0.08]"
            >
              <Copy className="size-4" aria-hidden="true" />
              {answerCopied ? "Copied answer" : "Copy answer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={copyCorrelationId}
              disabled={!diagnostics?.correlationId}
              className="h-9 rounded-xl text-[hsl(191,73%,72%)] hover:bg-[hsla(191,73%,56%,0.12)]"
              aria-label="Copy correlation ID"
            >
              <Copy className="size-4" aria-hidden="true" />
              {copied ? "Copied trace" : "Copy trace"}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-[hsla(240,14%,6%,0.72)] p-3 text-xs sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Timestamp</p>
              <p className="mt-1 font-medium text-foreground">
                {diagnostics?.timestamp ? new Date(diagnostics.timestamp).toLocaleString() : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Latency</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-foreground">
                <Clock3 className="size-3.5" aria-hidden="true" />
                {formatLatency(diagnostics?.latencyMs ?? null)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Correlation ID</p>
              <p className="mt-1 truncate font-medium text-foreground">
                {diagnostics?.correlationId || "-"}
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
