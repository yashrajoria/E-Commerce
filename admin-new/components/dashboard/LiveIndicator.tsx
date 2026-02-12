/**
 * LiveIndicator – Real-time status indicator for the dashboard header
 * Shows animated pulse for live data updates
 */
import { motion } from "framer-motion";

interface LiveIndicatorProps {
  label?: string;
  className?: string;
}

export function LiveIndicator({
  label = "Live",
  className = "",
}: LiveIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
