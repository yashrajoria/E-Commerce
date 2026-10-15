import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Renders the bordered, shadowed surface that wraps a card's sections.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Order summary</CardTitle>
 *   </CardHeader>
 *   <CardContent>3 items</CardContent>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-xs",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Renders the padded header region of a {@link Card}, stacking the title and description.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Monthly revenue</CardTitle>
 *   <CardDescription>Compared with the previous month</CardDescription>
 * </CardHeader>
 * ```
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Renders a card heading as an `h3`.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardTitle>Customer details</CardTitle>
 * ```
 */
export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-none tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Renders muted supporting copy under a {@link CardTitle}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardDescription>Updated 5 minutes ago</CardDescription>
 * ```
 */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Renders the padded body region of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardContent>3 items in this order</CardContent>
 * ```
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/**
 * Renders the footer region of a {@link Card} for secondary content.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <span>Last updated 5 minutes ago</span>
 * </CardFooter>
 * ```
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * Renders a bordered action bar, typically pinned to the bottom of a {@link Card}.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <CardAction>
 *   <span>Total £42.00</span>
 *   <Button size="sm">Checkout</Button>
 * </CardAction>
 * ```
 */
export const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between border-t border-border px-5 py-3 sm:px-6",
      className,
    )}
    {...props}
  />
));
CardAction.displayName = "CardAction";
