import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React from "react";

/** A prebuilt workflow-lane card with a ready-to-run prompt. */
export interface TemplateCard {
  /** Lane title shown on the card. */
  title: string;
  /** Short explanation of what the lane investigates. */
  description: string;
  /** Prompt wording inserted into the composer when the lane is opened. */
  prompt: string;
}

/** Built-in workflow lanes offered on the AI Insights workspace. */
export const TEMPLATE_CARDS: TemplateCard[] = [
  {
    title: "Revenue Pulse",
    description:
      "Track unusual swings by category and location with recommended interventions.",
    prompt:
      "Highlight unusual revenue swings by category, city, and channel in the last 7 days.",
  },
  {
    title: "Return Risk",
    description:
      "Surface return hotspots and propose policy and fulfillment changes.",
    prompt:
      "Identify return hotspots by SKU and reason-code with corrective actions.",
  },
  {
    title: "Campaign Impact",
    description:
      "Map campaign influence to conversion quality and margin outcomes.",
    prompt:
      "Evaluate campaign performance vs margin contribution and suggest reallocation.",
  },
];

/** Props accepted by {@link TemplateCardsGrid}. */
interface TemplateCardsGridProps {
  /**
   * Called with the lane's prompt when a template card is clicked.
   *
   * @param prompt - Prompt wording for the selected lane.
   */
  onSelectPrompt: (prompt: string) => void;
  /** Whether the user prefers reduced motion; disables entrance offsets and hover movement. */
  prefersReducedMotion?: boolean | null;
  /** Base delay, in seconds, applied to the grid's entrance animation. */
  staggerDelay: number;
}

/**
 * Renders the grid of workflow-lane template cards that autofill the composer.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <TemplateCardsGrid
 *   onSelectPrompt={handleSelectTemplate}
 *   prefersReducedMotion={prefersReducedMotion}
 *   staggerDelay={staggerDelay}
 * />
 * ```
 */
export function TemplateCardsGrid({
  onSelectPrompt,
  prefersReducedMotion,
  staggerDelay,
}: TemplateCardsGridProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: staggerDelay }}
      className="mt-5 grid gap-3 xl:grid-cols-3"
    >
      {TEMPLATE_CARDS.map((template, index) => (
        <motion.button
          key={template.title}
          type="button"
          onClick={() => onSelectPrompt(template.prompt)}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.24,
            delay: prefersReducedMotion ? 0 : 0.06 + index * 0.04,
          }}
          whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.01 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
          className="glass-effect glass-hover rounded-[26px] border border-white/10 p-4 text-left transition hover:border-[hsla(23,83%,58%,0.3)]"
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
  );
}
