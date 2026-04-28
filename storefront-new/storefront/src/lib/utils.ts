export { cn, formatGBP, trapFocus } from "@ecommerce/shared";

import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

export function getLucideIcon(name?: string | null) {
  const fallback = LucideIcons.Package as ComponentType<LucideProps>;
  if (!name) return fallback;

  const iconMap = LucideIcons as unknown as Record<
    string,
    ComponentType<LucideProps>
  >;

  return iconMap[name] || fallback;
}
