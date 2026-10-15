"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";

/**
 * Provides the shared delay and skip-delay configuration for the tooltips it wraps.
 *
 * @remarks
 * Client Component — declares `"use client"`. Wrap an app or page subtree once so every
 * {@link Tooltip} inside it shares the provider configuration.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={200}>
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <Button variant="ghost">Info</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>Order statuses explained</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Renders the Radix tooltip root that owns the open state.
 *
 * @remarks
 * Client Component — declares `"use client"`. Must be rendered inside a {@link TooltipProvider}.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button variant="ghost">Info</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>Order statuses explained</TooltipContent>
 * </Tooltip>
 * ```
 */
export const Tooltip = TooltipPrimitive.Root;

/**
 * Renders the element that shows a {@link Tooltip} on hover or focus; use `asChild` to delegate to your own element.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <TooltipTrigger asChild>
 *   <Button variant="ghost" size="icon">?</Button>
 * </TooltipTrigger>
 * ```
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Renders the portalled tooltip bubble with the tooltip text.
 *
 * @remarks
 * Client Component — declares `"use client"`. Sits `4px` from the trigger by default; override
 * with `sideOffset` or choose a placement with `side`.
 *
 * @example
 * ```tsx
 * <TooltipContent side="bottom">Copied to clipboard</TooltipContent>
 * ```
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
