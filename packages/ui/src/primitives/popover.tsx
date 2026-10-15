"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";

/**
 * Renders the Radix popover root that owns the open state.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Filters</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>Filter controls</PopoverContent>
 * </Popover>
 * ```
 */
export const Popover = PopoverPrimitive.Root;

/**
 * Renders the element that toggles a {@link Popover}; use `asChild` to delegate to your own button.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <PopoverTrigger asChild>
 *   <Button size="sm">Open</Button>
 * </PopoverTrigger>
 * ```
 */
export const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Renders the portalled popover panel, anchored to its trigger.
 *
 * @remarks
 * Client Component — declares `"use client"`. Defaults to centre alignment with a `4px` offset
 * from the trigger; both can be overridden via `align` and `sideOffset`.
 *
 * @example
 * ```tsx
 * <PopoverContent align="end">
 *   <p className="text-xs">Filter by status</p>
 * </PopoverContent>
 * ```
 */
export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
