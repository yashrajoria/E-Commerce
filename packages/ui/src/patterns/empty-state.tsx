import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";

/** Props accepted by {@link EmptyState}. */
export interface EmptyStateProps {
  /** Icon rendered inside the circular badge above the title. */
  icon?: React.ReactNode;
  /** Headline explaining that there is nothing to show. */
  title: string;
  /** Supporting sentence rendered below the title. */
  description?: string;
  /** Optional call-to-action rendered as a small button; supplying `href` renders it as a link instead of a button. */
  action?: {
    /** Text shown on the button or link. */
    label: string;
    /** Click handler invoked when the action has no `href`. */
    onClick?: () => void;
    /** Destination URL; when set, the action renders as an anchor. */
    href?: string;
  };
  /** Extra classes merged onto the outer container. */
  className?: string;
}

/**
 * Renders a centred placeholder for lists, tables and pages with no content, optionally with a call-to-action.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<PackageSearch className="h-5 w-5" />}
 *   title="No orders yet"
 *   description="Orders you place will appear here."
 *   action={{ label: "Browse products", href: "/products" }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 p-8 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          <Button
            size="sm"
            onClick={action.onClick}
            asChild={Boolean(action.href)}
          >
            {action.href ? (
              <a href={action.href}>{action.label}</a>
            ) : (
              action.label
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
