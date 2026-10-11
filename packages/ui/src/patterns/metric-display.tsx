import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export interface MetricDisplayProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function MetricDisplay({
  label,
  value,
  delta,
  icon,
  subtitle,
  className,
}: MetricDisplayProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
          {value}
        </span>
      </div>

      {(delta || subtitle) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                delta.trend === "up" && "text-success",
                delta.trend === "down" && "text-destructive",
                delta.trend === "neutral" && "text-muted-foreground"
              )}
            >
              {delta.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
              {delta.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
              {delta.trend === "neutral" && <Minus className="h-3 w-3" />}
              {delta.value}
            </span>
          )}
          {delta?.label && <span>{delta.label}</span>}
          {subtitle && !delta?.label && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
