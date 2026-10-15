"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const labelVariants = cva(
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

/**
 * Renders a small-caps form label tied to a control.
 *
 * @remarks
 * Client Component — declares `"use client"`.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email address</Label>
 * ```
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
