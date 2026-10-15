/**
 * LiveIndicator – Real-time status indicator for the dashboard header
 * Shows animated pulse for live data updates
 */
import { motion } from "framer-motion";

/** Props accepted by {@link LiveIndicator}. */
interface LiveIndicatorProps {
  /**
   * Text shown next to the pulsing dot.
   *
   * @defaultValue "Live"
   */
  label?: string;
  /**
   * Extra classes merged onto the pill container.
   *
   * @defaultValue ""
   */
  className?: string;
}

/**
 * Renders an animated live-status pill with a pulsing dot for the dashboard header.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <LiveIndicator />
 * <LiveIndicator label="Streaming" className="ml-auto" />
 * ```
 */
export function LiveIndicator({
  label = "Live",
  className = "",
}: LiveIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsla(191,73%,56%,0.1)] border border-[hsla(191,73%,56%,0.2)] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-[hsl(191,73%,60%)]"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(191,73%,60%)]" />
      </span>
      <span className="text-[11px] font-semibold text-[hsl(191,73%,72%)] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
