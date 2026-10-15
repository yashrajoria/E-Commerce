/**
 * Re-exports shared formatting/utility helpers (`cn`, `formatGBP`, `trapFocus`)
 * from `@ecommerce/shared` and adds the storefront Lucide icon resolver.
 */
export { cn, formatGBP, trapFocus } from "@ecommerce/shared";

import {
  Baby,
  Book,
  Camera,
  Car,
  Gift,
  Headphones,
  Heart,
  Home,
  Laptop,
  Package,
  Shirt,
  ShoppingBag,
  Smartphone,
  Star,
  Watch,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/** Explicit icon map — avoid `import * as lucide-react` (bundle bloat). */
const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Package,
  Shirt,
  Home,
  Smartphone,
  Watch,
  ShoppingBag,
  Heart,
  Star,
  Laptop,
  Camera,
  Headphones,
  Baby,
  Car,
  Book,
  Gift,
};

/**
 * Resolves a Lucide icon name to its component, falling back to the package
 * icon for unknown or missing names.
 *
 * @param name - Lucide icon name stored on a category (for example `"Shirt"`); may be nullish.
 * @returns The matching Lucide icon component, or `Package` when `name` is empty or unrecognized.
 */
export function getLucideIcon(name?: string | null) {
  if (!name) return Package;
  return ICON_MAP[name] || Package;
}
