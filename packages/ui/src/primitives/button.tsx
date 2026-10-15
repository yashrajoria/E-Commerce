"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * Builds the class list for {@link Button}.
 *
 * @remarks
 * Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `accent`.
 * Sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`. The `default` variant and
 * `default` size are used when neither is supplied.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:opacity-90 active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.99]",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted active:scale-[0.99]",
        ghost: "text-foreground hover:bg-muted active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.99]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        accent:
          "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.99]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Props accepted by {@link Button}. */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Renders the single child element instead of a `button`, merging the button styles onto it.
   *
   * @defaultValue false
   */
  asChild?: boolean;
}

/**
 * Renders the design-system button in the requested variant and size, with optional Slot delegation.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="sm" onClick={handleRetry}>
 *   Retry
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
