import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingSpinner } from "./loading-spinner";

export interface LoadingStateProps {
  label?: string;
  description?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function LoadingState({
  label = "Loading...",
  description,
  className,
  size = "default",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center p-8 text-center",
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"} />
      {label && (
        <p className="mt-3 text-xs font-medium text-foreground tracking-tight">
          {label}
        </p>
      )}
      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
