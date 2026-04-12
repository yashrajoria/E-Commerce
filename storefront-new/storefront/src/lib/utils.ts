import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGBP(value?: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value ?? 0);
}

export function getLucideIcon(name?: string | null) {
  const fallback = LucideIcons.Package as ComponentType<LucideProps>;
  if (!name) return fallback;

  const iconMap = LucideIcons as Record<
    string,
    ComponentType<LucideProps>
  >;

  return iconMap[name] || fallback;
}
