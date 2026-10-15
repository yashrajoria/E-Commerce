"use client";

import * as React from "react";

import { cn } from "../../utils";

/**
 * Renders a rounded, bordered surface that groups related content.
 *
 * @remarks
 * Client Component — declares `"use client"`. Compose it with
 * {@link CardHeader}, {@link CardTitle}, {@link CardDescription},
 * {@link CardAction}, {@link CardContent} and {@link CardFooter}.
 *
 * @example
 * ```tsx
 * <Card className="w-80">
 *   <CardHeader>
 *     <CardTitle>Revenue</CardTitle>
 *     <CardDescription>Last 30 days</CardDescription>
 *   </CardHeader>
 *   <CardContent>{formatCurrency(12400)}</CardContent>
 * </Card>
 * ```
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the header row of a {@link Card} that lays out title, description and action.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Recent orders</CardTitle>
 *   <CardDescription>Updated hourly</CardDescription>
 * </CardHeader>
 * ```
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the semibold title line of a {@link Card}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardTitle>Revenue</CardTitle>
 * ```
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

/**
 * Renders muted helper text below a {@link CardTitle}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardDescription>Last 30 days</CardDescription>
 * ```
 */
function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Renders an action slot aligned to the top-right of a {@link CardHeader}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Revenue</CardTitle>
 *   <CardAction>
 *     <Button size="sm" variant="ghost">
 *       Export
 *     </Button>
 *   </CardAction>
 * </CardHeader>
 * ```
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the main body area of a {@link Card} with horizontal padding.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardContent>{formatCurrency(12400)}</CardContent>
 * ```
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

/**
 * Renders the footer row of a {@link Card} for secondary actions or metadata.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">View all orders</Button>
 * </CardFooter>
 * ```
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
