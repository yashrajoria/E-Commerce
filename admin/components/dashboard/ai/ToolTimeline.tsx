import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Activity, Wrench, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgentToolResult } from "@/types/ai-insights";

interface ToolTimelineProps {
  toolResults: AgentToolResult[];
  toolsCalled: string[];
}

const normalizeToolName = (toolResult: AgentToolResult) => {
  if (typeof toolResult.tool === "string") {
    return toolResult.tool;
  }
  if (typeof toolResult.name === "string") {
    return toolResult.name;
  }
  return "tool";
};

export const ToolTimeline = ({ toolResults, toolsCalled }: ToolTimelineProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(true);

  const hasToolFailures = useMemo(() => {
    return toolResults.some((item) => item.success === false || item.status === "error" || item.error);
  }, [toolResults]);
  const successfulSteps = toolResults.filter(
    (item) => !(item.success === false || item.status === "error" || item.error),
  ).length;

  return (
    <section
      aria-label="Tool execution timeline"
      className="glass-effect rounded-[28px] p-4 text-foreground"
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <Activity className="size-4 text-[hsl(191,73%,62%)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold">Tool Execution Timeline</h3>
        {hasToolFailures && (
          <Badge className="bg-[hsla(35,74%,64%,0.2)] text-[hsl(35,74%,82%)]">
            <AlertCircle className="size-3" aria-hidden="true" />
            Partial
          </Badge>
        )}
        <ChevronDown
          className={`ml-auto size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Steps
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{toolResults.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Successful
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{successfulSteps}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Mode
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {toolResults.length === 0 ? "Direct" : "Tool-backed"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {toolsCalled.length === 0 ? (
          <span className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
            No explicit tools invoked
          </span>
        ) : (
          toolsCalled.map((tool) => (
            <Badge key={tool} variant="outline" className="border-[hsla(23,83%,58%,0.38)] bg-[hsla(23,83%,58%,0.14)] text-[hsl(26,86%,84%)]">
              {tool}
            </Badge>
          ))
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="timeline-content"
            initial={{ opacity: 0, height: prefersReducedMotion ? "auto" : 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: prefersReducedMotion ? "auto" : 0 }}
            transition={{ duration: 0.24 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
          {toolResults.length === 0 && (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground">
              The model returned a direct answer without a tool trace.
            </p>
          )}
          {toolResults.map((toolResult, index) => {
            const status =
              toolResult.success === false || toolResult.status === "error" || toolResult.error
                ? "error"
                : "success";
            const hasOutput = typeof toolResult.output !== "undefined";
            const outputText = hasOutput ? JSON.stringify(toolResult.output, null, 2) : "";

            return (
              <motion.article
                key={`${normalizeToolName(toolResult)}-${index}`}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: prefersReducedMotion ? 0 : index * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[11px] font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <Wrench className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">{normalizeToolName(toolResult)}</p>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      status === "success"
                        ? "bg-[hsla(191,73%,56%,0.18)] text-[hsl(191,73%,82%)]"
                        : "bg-[hsla(35,74%,64%,0.2)] text-[hsl(35,74%,82%)]"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {typeof toolResult.duration_ms === "number" && (
                  <p className="mt-2 text-xs text-muted-foreground">Duration: {toolResult.duration_ms} ms</p>
                )}

                {toolResult.error && (
                  <p className="mt-2 rounded bg-[hsla(35,74%,64%,0.12)] px-2 py-1 text-xs text-[hsl(35,74%,80%)]">
                    {String(toolResult.error)}
                  </p>
                )}

                {hasOutput && (
                  <details className="mt-2 rounded-lg border border-white/10 bg-[hsla(240,14%,6%,0.66)] p-2">
                    <summary className="cursor-pointer text-xs text-[hsl(191,73%,72%)]">View output</summary>
                    <pre className="mt-2 max-h-44 overflow-auto text-[11px] text-foreground">
                      {outputText}
                    </pre>
                  </details>
                )}
              </motion.article>
            );
          })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
