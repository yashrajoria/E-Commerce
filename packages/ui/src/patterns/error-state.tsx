import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Unable to load data",
  description = "Something went wrong while retrieving information. Please try again.",
  onRetry,
  actionLabel = "Retry",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 border-border/80 hover:bg-card text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
