import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Renders a pulsing placeholder block used while content loads.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" />
 * ```
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}
