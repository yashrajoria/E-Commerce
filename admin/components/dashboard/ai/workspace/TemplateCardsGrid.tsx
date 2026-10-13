import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React from "react";

export interface TemplateCard {
  title: string;
  description: string;
  prompt: string;
}

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

interface TemplateCardsGridProps {
  onSelectPrompt: (prompt: string) => void;
  prefersReducedMotion?: boolean | null;
  staggerDelay: number;
}

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
          whileHover={
            prefersReducedMotion ? undefined : { y: -3, scale: 1.01 }
          }
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

