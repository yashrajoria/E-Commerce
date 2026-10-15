import type { ElementType } from "react";

/** A single navigation entry rendered in the dashboard sidebar. */
export interface NavItem {
  /** Icon component rendered before the label. */
  icon: ElementType;
  /** Human-readable link text. */
  label: string;
  /** Route the entry navigates to. */
  path: string;
  /** Optional count badge displayed on the entry. */
  badge?: number;
  /** Group heading the entry is filed under; defaults to `"General"` when omitted. */
  section?: string;
}

/** Optional record-count badges keyed by sidebar section. */
export type BadgeCounts = {
  /** Number of products, shown on the Products entry. */
  products?: number;
  /** Number of orders, shown on the Orders entry. */
  orders?: number;
  /** Number of customers, shown on the Customers entry. */
  customers?: number;
  /** Number of inventory alerts, shown on the Inventory entry. */
  inventory?: number;
};
