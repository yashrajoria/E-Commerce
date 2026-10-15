"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils";

/**
 * Renders the root of a tab set, owning the active tab state.
 *
 * @remarks
 * Client Component — declares `"use client"`. Built on Radix UI's tabs
 * primitive; compose it with {@link TabsList}, {@link TabsTrigger} and
 * {@link TabsContent}.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="details">
 *   <TabsList>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="reviews">Reviews</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="details">Product details</TabsContent>
 *   <TabsContent value="reviews">Customer reviews</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * Renders the row that holds the {@link TabsTrigger} buttons.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <TabsList>
 *   <TabsTrigger value="details">Details</TabsTrigger>
 * </TabsList>
 * ```
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the button that activates its matching {@link TabsContent}.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <TabsTrigger value="reviews" disabled={reviewsLoading}>
 *   Reviews
 * </TabsTrigger>
 * ```
 */
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Renders the panel shown while its matching {@link TabsTrigger} is active.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <TabsContent value="reviews">Customer reviews</TabsContent>
 * ```
 */
function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
