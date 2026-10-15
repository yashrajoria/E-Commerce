"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../utils";

/**
 * Renders a form label that dims when its associated control is disabled.
 *
 * @remarks
 * Client Component — declares `"use client"`. Built on Radix UI's label
 * primitive, so `htmlFor` wires it to the matching control.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * ```
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
