"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../lib/utils";

/**
 * Renders a Radix separator line in the given orientation.
 *
 * @remarks
 * Client Component — declares `"use client"`. Defaults to a horizontal, decorative separator;
 * pass `orientation="vertical"` for a divider between inline items.
 *
 * @example
 * ```tsx
 * <>
 *   <div>Account</div>
 *   <Separator className="my-4" />
 *   <div>Billing</div>
 * </>
 * ```
 */
export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
