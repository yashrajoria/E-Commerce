import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  History,
  Sparkles,
} from "lucide-react";
import React, { useMemo } from "react";

/** Props accepted by {@link OperatingSignalsGrid}. */
interface OperatingSignalsGridProps {
  /** Number of exchanges stored in the session history. */
  historyCount: number;
  /** Number of prompts saved in the vault. */
  savedPromptsCount: number;
  /** Number of tool definitions available to the assistant. */
  toolsCount: number;
  /** Title of the page the user arrived from, when a context handoff happened. */
  sourceTitle?: string;
  /** Latest response latency in milliseconds, when recorded. */
  latencyMs?: number | null;
  /** Whether the user prefers reduced motion; disables entrance offsets. */
  prefersReducedMotion?: boolean | null;
  /** Base delay, in seconds, applied to the grid's entrance animation. */
  staggerDelay: number;
}

/**
 * Renders the four operating-signal tiles summarising session memory, prompt
 * library, tool readiness and handoff/latency status.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <OperatingSignalsGrid
 *   historyCount={history.length}
 *   savedPromptsCount={savedPrompts.length}
 *   toolsCount={toolDefinitions.length}
 *   latencyMs={diagnostics?.latencyMs}
 *   staggerDelay={0.1}
 * />
 * ```
 */
export function OperatingSignalsGrid({
  historyCount,
  savedPromptsCount,
  toolsCount,
  sourceTitle,
  latencyMs,
  prefersReducedMotion,
  staggerDelay,
}: OperatingSignalsGridProps) {
  const operatingSignals = useMemo(
    () => [
      {
        label: "Session Memory",
        value: historyCount,
        detail: historyCount
          ? "Previous exchanges ready for follow-up"
          : "Fresh workspace context",
        icon: History,
      },
      {
        label: "Prompt Library",
        value: savedPromptsCount,
        detail: savedPromptsCount
          ? "Reusable prompts saved for later"
          : "Save your strongest prompts",
        icon: Sparkles,
      },
      {
        label: "Tool Readiness",
        value: toolsCount,
        detail: toolsCount
          ? "Available tool definitions loaded"
          : "Awaiting tool catalog",
        icon: BrainCircuit,
      },
      {
        label: sourceTitle ? "Context Handoff" : "Response Speed",
        value: sourceTitle || (latencyMs ? `${latencyMs}ms` : "Live"),
        detail: sourceTitle
          ? `Jumped in from ${sourceTitle}`
          : "Latency and tool traces stay visible",
        icon: sourceTitle ? ArrowUpRight : Clock3,
      },
    ],
    [historyCount, latencyMs, savedPromptsCount, sourceTitle, toolsCount],
  );

  return (
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
            transition={{
              duration: 0.22,
              delay: prefersReducedMotion ? 0 : 0.05 + index * 0.04,
            }}
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
  );
}
