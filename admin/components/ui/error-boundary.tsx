/**
 * Enhanced Error Boundary Component
 * Catches errors and displays user-friendly error messages
 */

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

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
            {process.env.NODE_ENV === 'development'
              ? this.state.error.message
              : 'An error occurred. Please try refreshing the page.'}
          </p>
          <div className="flex gap-2">
            <Button onClick={this.reset} variant="secondary">
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
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

/**
 * Async Error Boundary for use with Suspense
 */
export function AsyncErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}) {
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
