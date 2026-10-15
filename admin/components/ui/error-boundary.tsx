/**
 * Enhanced Error Boundary Component
 * Catches errors and displays user-friendly error messages
 */

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";

/** Props accepted by {@link ErrorBoundary}. */
interface ErrorBoundaryProps {
  /** Subtree protected by the boundary. */
  children: ReactNode;
  /** Custom render for the error state; receives the caught error and a callback that clears it. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Called with the error and React error info after a descendant throws. */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/** State tracked by {@link ErrorBoundary} while rendering its subtree. */
interface ErrorBoundaryState {
  /** Whether a descendant has thrown since the last reset. */
  hasError: boolean;
  /** The error that was caught, or `null` while rendering normally. */
  error: Error | null;
}

/**
 * Catches render errors from its subtree and shows a themed fallback with retry and home actions.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Without a `fallback` prop it renders a built-in panel that exposes the raw error message in development only.
 *
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <DashboardContent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] glass-effect rounded-xl p-8 border border-red-500/20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
            {process.env.NODE_ENV === "development"
              ? this.state.error.message
              : "An error occurred. Please try refreshing the page."}
          </p>
          <div className="flex gap-2">
            <Button onClick={this.reset} variant="secondary">
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Go home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Props accepted by {@link AsyncErrorBoundary}, the async error boundary for use with Suspense. */
interface AsyncErrorBoundaryProps {
  /** Async subtree protected by the boundary. */
  children: ReactNode;
  /** Custom render for the error state; falls back to an inline alert card showing the message. */
  fallback?: (error: Error) => ReactNode;
}

/**
 * Wraps {@link ErrorBoundary} with a compact inline fallback suited to Suspense boundaries.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <AsyncErrorBoundary>
 *   <Suspense fallback={<LoadingSpinner />}>
 *     <RevenueChart />
 *   </Suspense>
 * </AsyncErrorBoundary>
 * ```
 */
export function AsyncErrorBoundary({
  children,
  fallback,
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error) =>
        fallback ? (
          fallback(error)
        ) : (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            <p className="text-sm font-medium">Failed to load content</p>
            <p className="text-xs opacity-75">{error.message}</p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
