import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Copy, AlertTriangle, RefreshCw, Clock3 } from "lucide-react";
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
          className="space-y-3"
        >
          <div className="h-7 w-44 animate-pulse rounded bg-slate-700/70" />
          <div className="space-y-2 rounded-2xl border border-slate-200/10 bg-slate-900/60 p-5">
            <div className="h-4 w-full animate-pulse rounded bg-slate-700/60" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-700/60" />
            <div className="h-4 w-9/12 animate-pulse rounded bg-slate-700/60" />
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
          className="rounded-2xl border border-[hsla(43,96%,56%,0.35)] bg-[hsla(43,96%,56%,0.1)] p-5 text-[hsl(43,96%,90%)]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-[hsl(43,96%,70%)]" aria-hidden="true" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Request could not be completed</h3>
              <p className="text-sm text-[hsl(43,96%,86%)]">
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
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-gradient text-lg font-semibold">AI answer canvas</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask a question to generate actionable insights with tool-backed evidence.
          </p>
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
          className="glass-effect border-gradient rounded-2xl p-5"
        >
      <div className="mb-4 h-1.5 w-40 rounded-full gradient-purple" />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge className="gradient-emerald text-white">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          {lifecycle === "partial" ? "Partial Success" : "Success"}
        </Badge>
        {lifecycle === "partial" && (
          <Badge className="bg-[hsla(43,96%,56%,0.2)] text-[hsl(43,96%,80%)]">Some tools failed</Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">Primary Answer</span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{answer}</p>

      <div className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-[hsla(240,14%,6%,0.72)] p-3 text-xs sm:grid-cols-3">
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
          <div className="mt-1 flex items-center gap-2">
            <p className="truncate font-medium text-foreground">{diagnostics?.correlationId || "-"}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyCorrelationId}
              disabled={!diagnostics?.correlationId}
              className="h-7 rounded-lg px-2 text-[hsl(160,84%,72%)] hover:bg-[hsla(160,84%,39%,0.18)]"
              aria-label="Copy correlation ID"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
