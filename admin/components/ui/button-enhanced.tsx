/**
 * Enhanced Button Component with better accessibility and animations
 * Supports multiple variants, sizes, and states
 */

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Class-variance-authority recipe describing the {@link Button} variant, size and loading styles.
 *
 * @remarks
 * Call the recipe directly to reuse the button styling on other elements, e.g. `buttonVariants({ variant: "ghost", size: "icon" })`.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/50 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
        outline: "border border-border text-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
      isLoading: {
        true: "relative !text-transparent pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/** Props accepted by the enhanced {@link Button}. */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner overlay and disables the button while truthy. */
  isLoading?: boolean;
  /** Leading node rendered inside an extra margin wrapper before the label. */
  icon?: React.ReactNode;
  /** Button label or content. */
  children?: React.ReactNode;
}

/**
 * Renders a gradient-capable button with loading spinner, leading icon and six visual variants.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Button variant="success" size="lg" isLoading={saving} icon={<Save className="h-4 w-4" />}>
 *   Save changes
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, isLoading }), className)}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
