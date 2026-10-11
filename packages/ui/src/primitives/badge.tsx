import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium tracking-tight transition-colors border",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        accent:
          "border-transparent bg-accent text-accent-foreground",
        success:
          "border-success/20 bg-success/10 text-success dark:text-success",
        warning:
          "border-warning/20 bg-warning/10 text-warning dark:text-warning",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive dark:text-destructive",
        info:
          "border-info/20 bg-info/10 text-info dark:text-info",
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
