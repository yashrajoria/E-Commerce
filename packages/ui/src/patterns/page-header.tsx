import * as React from "react";
import { cn } from "../lib/utils";

/** Props accepted by {@link PageHeader}. */
export interface PageHeaderProps {
  /** Page title rendered as an `h1`. */
  title: string;
  /** Supporting sentence rendered below the title. */
  description?: string;
  /** Actions rendered on the right of the title on wider viewports. */
  children?: React.ReactNode;
  /** Extra classes merged onto the outer container. */
  className?: string;
}

/**
 * Renders a page title row with an optional description and right-aligned actions.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <PageHeader title="Orders" description="All orders placed through the storefront.">
 *   <Button size="sm">Export</Button>
 * </PageHeader>
 * ```
 */
export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 pb-6 pt-2 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
