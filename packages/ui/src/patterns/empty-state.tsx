import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

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
        className
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
            {action.href ? <a href={action.href}>{action.label}</a> : action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
