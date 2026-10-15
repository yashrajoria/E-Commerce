import * as React from "react";
import { cn } from "../lib/utils";

/** Props accepted by {@link Textarea}; the native `<textarea>` attributes. */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Renders a styled multi-line text input.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Textarea rows={4} placeholder="Delivery notes" value={notes} />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
