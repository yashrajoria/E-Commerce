import type { ElementType } from "react";

export interface NavItem {
  icon: ElementType;
  label: string;
  path: string;
  badge?: number;
  section?: string;
}

export type BadgeCounts = {
  products?: number;
  orders?: number;
  customers?: number;
  inventory?: number;
};

