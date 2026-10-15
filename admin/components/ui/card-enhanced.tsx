/**
 * Enhanced Card Component
 * Provides consistent card styling with multiple variants
 */

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Class-variance-authority recipe describing the {@link Card} variant, padding and interactivity styles.
 */
const cardVariants = cva("rounded-xl border transition-all duration-200", {
  variants: {
    variant: {
      default: "glass-effect border-border bg-card hover:bg-accent/40",
      elevated: "glass-effect border-border bg-card shadow-lg shadow-black/10",
      flat: "bg-muted/40 border border-border",
      outline: "border-border bg-transparent hover:bg-accent/40",
      success: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
      error: "border-red-500/30 bg-red-500/5 hover:bg-red-500/10",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
    interactive: {
      true: "cursor-pointer active:scale-[0.98]",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    interactive: false,
  },
});

/**
 * Props accepted by the enhanced {@link Card}.
 *
 * @remarks
 * Adds the `variant`, `padding` and `interactive` options produced by `cardVariants` to the standard div attributes.
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Renders the glass-styled surface used for every admin panel block.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <CardHeader>
 *     <CardTitle>Recent orders</CardTitle>
 *   </CardHeader>
 *   <CardContent>…</CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/** Props accepted by {@link CardHeader}. */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Pins the header to the top of the scrolling card body.
   *
   * @defaultValue false
   */
  sticky?: boolean;
}

/**
 * Renders the bordered header strip of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardHeader sticky>
 *   <CardTitle>Inventory</CardTitle>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 border-b border-border px-6 py-4",
        sticky && "sticky top-0 z-10",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

/**
 * Renders the `h2` heading of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardTitle>Top products</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Renders the muted supporting paragraph of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardDescription>Updated 5 minutes ago</CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Renders the body area of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <OrdersTable orders={orders} />
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Renders the bottom action strip of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="ghost">View all</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-t border-border px-6 py-3",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
