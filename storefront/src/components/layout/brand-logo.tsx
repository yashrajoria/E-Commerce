import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  isLink?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ className, isLink = true, size = "md" }: BrandLogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center font-bold tracking-tight bg-primary text-primary-foreground rounded-lg transition-transform duration-200 group-hover:scale-105 shadow-xs border border-primary/20",
          size === "sm" && "h-7 w-7 text-xs rounded-md",
          size === "md" && "h-8.5 w-8.5 text-sm",
          size === "lg" && "h-10 w-10 text-base rounded-xl"
        )}
      >
        <span className="font-bold tracking-tighter">S</span>
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span
          className={cn(
            "font-bold tracking-tight text-foreground transition-colors",
            size === "sm" && "text-base",
            size === "md" && "text-lg",
            size === "lg" && "text-xl"
          )}
        >
          Shop<span className="font-medium text-primary">Swift</span>
        </span>
      </div>
    </div>
  );

  if (!isLink) {
    return content;
  }

  return (
    <Link
      href="/"
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      {content}
    </Link>
  );
}
