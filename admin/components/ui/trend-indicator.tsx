/**
 * TrendIndicator – Shows percentage change with up/down arrow and color
 */
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Props accepted by {@link TrendIndicator}. */
interface TrendIndicatorProps {
  /** Signed percentage change; the sign selects the arrow and colour. */
  value: number;
  /**
   * Unit appended after the absolute value.
   *
   * @defaultValue "%"
   */
  suffix?: string;
  /** Additional classes merged onto the wrapper span. */
  className?: string;
  /**
   * Size variant.
   *
   * @defaultValue "sm"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Renders an absolute percentage change with a directional arrow and semantic colour.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Shown beside a product's sales figure in the dashboard table.
 * <TrendIndicator value={-4.2} />
 * ```
 */
export function TrendIndicator({
  value,
  suffix = "%",
  className,
  size = "sm",
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;

  const sizeClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1",
  };

  const iconSizes = { sm: 12, md: 14, lg: 16 };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold",
        sizeClasses[size],
        isPositive && "text-emerald-400",
        !isPositive && !isNeutral && "text-red-400",
        isNeutral && "text-slate-400",
        className,
      )}
    >
      <Icon size={iconSizes[size]} />
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}
