/**
 * StatusBadge – Premium status indicator with pulse animation
 * Used for order status, activity type, and system states
 */
import { cn } from "@/lib/utils";

/** Colour and dot style of a {@link StatusBadge}. */
type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "gold";

/** Props accepted by {@link StatusBadge}. */
interface StatusBadgeProps {
  /** Semantic colour scheme applied to the badge and its pulse dot. */
  variant: StatusVariant;
  /** Text shown inside the badge. */
  label: string;
  /**
   * Show animated pulse dot.
   *
   * @defaultValue false
   */
  pulse?: boolean;
  /**
   * Size variant.
   *
   * @defaultValue "sm"
   */
  size?: "sm" | "md";
  /** Additional classes merged onto the badge. */
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  gold: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const dotStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  info: "bg-blue-400",
  neutral: "bg-slate-400",
  gold: "bg-yellow-400",
};

/**
 * Renders a pill-shaped status chip with an optional pulsing indicator dot.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Used by the dashboard activity feed for each log entry.
 * <StatusBadge variant="success" label="Completed" pulse />
 * ```
 */
export function StatusBadge({
  variant,
  label,
  pulse = false,
  size = "sm",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        variantStyles[variant],
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotStyles[variant],
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              dotStyles[variant],
            )}
          />
        </span>
      )}
      {label}
    </span>
  );
}
