/**
 * StatusBadge – Premium status indicator with pulse animation
 * Used for order status, activity type, and system states
 */
import { cn } from "@/lib/utils";

type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "gold";

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  /** Show animated pulse dot */
  pulse?: boolean;
  /** Size variant */
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error:
    "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral:
    "bg-slate-500/10 text-slate-400 border-slate-500/20",
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
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dotStyles[variant]
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              dotStyles[variant]
            )}
          />
        </span>
      )}
      {label}
    </span>
  );
}
