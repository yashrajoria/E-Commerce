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

export function getLucideIcon(name?: string | null) {
  if (!name) return Package;
  return ICON_MAP[name] || Package;
}
