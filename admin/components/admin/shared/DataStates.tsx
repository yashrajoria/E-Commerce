import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

/**
 * Props accepted by {@link TableSkeleton}.
 */
interface TableSkeletonProps {
  /**
   * Number of skeleton rows to render.
   *
   * @defaultValue 5
   */
  rows?: number;
  /**
   * Number of skeleton columns rendered in each row.
   *
   * @defaultValue 4
   */
  cols?: number;
}

/**
 * Renders a table body of pulsing skeleton rows while list data is loading.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Placed inside a <Table> element while rows are loading.
 * <TableSkeleton rows={5} cols={4} />
 * ```
 */
export function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <Skeleton className="h-6 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

/**
 * Props accepted by {@link EmptyState}.
 */
interface EmptyStateProps {
  /** Headline shown above the description. */
  title: string;
  /** Optional supporting copy shown under the headline. */
  description?: string;
  /** Custom node rendered instead of the built-in action button. */
  action?: React.ReactNode;
  /**
   * Icon rendered inside the gradient badge.
   *
   * @defaultValue Ban
   */
  icon?: LucideIcon;
  /** Label for the built-in action button, rendered only when `action` is not supplied. */
  actionLabel?: string;
  /** Click handler for the built-in action button. */
  onAction?: () => void;
}

/**
 * Renders a centred empty-state panel with an icon badge, headline, description and optional action.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No inventory found"
 *   description="Your inventory will appear here"
 *   actionLabel="Add product"
 *   onAction={handleAddProduct}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Ban,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl gradient-purple glow-purple flex items-center justify-center mb-6">
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action}
      {!action && actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="gradient-purple text-white hover:opacity-90 rounded-xl border-0"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

/** Props accepted by {@link ErrorState}. */
interface ErrorStateProps {
  /** Error text to display; falls back to a generic message when omitted. */
  message?: string;
  /** When provided, renders a retry button that invokes this handler. */
  onRetry?: () => void;
}

/**
 * Renders a destructive alert summarising a failed data fetch, with an optional retry button.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ErrorState message="Failed to load support tickets." onRetry={() => refetch()} />
 * ```
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="flex flex-col items-center">
      <AlertCircle className="w-6 h-6 mb-2" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message || "Something went wrong."}</AlertDescription>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </Alert>
  );
}

/** Props accepted by {@link StatusBadge}. */
interface StatusBadgeProps {
  /** Status value to display; also selects the badge colour variant. */
  status: string;
}

/**
 * Renders a status badge whose colour variant is derived from the status value.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 * Known statuses map to `secondary`, `default` or `destructive`; unrecognised values fall back to `secondary`.
 *
 * @example
 * ```tsx
 * <StatusBadge status="shipped" />
 * ```
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, "secondary" | "default" | "destructive"> = {
    pending: "secondary",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    sent: "default",
    failed: "destructive",
    active: "default",
    expired: "secondary",
  };
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
}
