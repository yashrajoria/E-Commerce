"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Class-variance-authority recipe behind {@link Badge}'s styling.
 *
 * @remarks
 * Variants: `default`, `secondary`, `destructive` and `outline`.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/** Props accepted by {@link Badge}. */
type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /**
     * Renders the single child element instead of a `<span>`, merging the
     * badge props onto it through Radix `Slot`.
     *
     * @defaultValue false
     */
    asChild?: boolean;
  };

/**
 * Renders a compact status label or tag.
 *
 * @remarks
 * Client Component — declares `"use client"`. Styling comes from the cva
 * recipe in {@link badgeVariants}.
 *
 * @example
 * ```tsx
 * <Badge variant="secondary">Processing</Badge>
 * ```
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
