/**
 * TrendIndicator – Shows percentage change with up/down arrow and color
 */
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: number;
  suffix?: string;
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

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
