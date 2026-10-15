import * as React from "react";
import { cn } from "../lib/utils";
import { LoadingSpinner } from "./loading-spinner";

/** Props accepted by {@link LoadingState}. */
export interface LoadingStateProps {
  /**
   * Caption rendered below the spinner.
   *
   * @defaultValue "Loading..."
   */
  label?: string;
  /** Secondary line rendered below the caption. */
  description?: string;
  /** Extra classes merged onto the outer container. */
  className?: string;
  /**
   * Spinner dimensions, forwarded to {@link LoadingSpinner}.
   *
   * @defaultValue "default"
   */
  size?: "sm" | "default" | "lg";
}

/**
 * Renders a centred loading panel with a spinner, caption and optional description.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <LoadingState label="Loading orders..." description="This only takes a moment." />
 * ```
 */
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
        className,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner
        size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
      />
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
