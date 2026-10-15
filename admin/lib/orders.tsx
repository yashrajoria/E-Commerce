import { Clock, RefreshCw, Truck, CheckCircle, XCircle } from "lucide-react";
import type {
  OrderStatus,
  Order,
  SortConfig,
  OrdersFilter,
} from "@/types/shared";

/**
 * Mapping of every {@link OrderStatus} to the icon rendered in the orders table.
 *
 * @remarks
 * Exported from a `.tsx` module because the values are JSX elements. Call sites
 * index it with a concrete status, falling back to `"pending"` when the order
 * has none.
 */
export const statusIcons = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  processing: <RefreshCw className="h-4 w-4 text-blue-400" />,
  shipped: <Truck className="h-4 w-4 text-violet-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  cancelled: <XCircle className="h-4 w-4 text-rose-500" />,
};

/**
 * Returns the Tailwind classes for an order status badge.
 *
 * @param status - Order status to style.
 * @returns The badge class string for `status`, falling back to the `"pending"` styling.
 */
export const getStatusBadgeStyle = (status: OrderStatus) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    shipped: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };
  return styles[status] || styles.pending;
};

/**
 * Filters and sorts an order list for the orders table.
 *
 * @remarks
 * Search matches order number, customer name and customer email
 * case-insensitively; `status: "all"` bypasses the status filter. Sorting keys
 * are `"date"`, `"total"` and `"customer"`; unknown keys leave the filtered
 * order untouched.
 *
 * @param orders - Orders to filter and sort.
 * @param filter - Search term and status filter to apply.
 * @param sortConfig - Sort key and direction; `"desc"` reverses the comparison.
 * @returns A new array containing the matching orders in sorted order.
 */
export const filterOrders = (
  orders: Order[],
  filter: OrdersFilter,
  sortConfig: SortConfig,
) => {
  const filteredOrders = orders.filter((order) => {
    const search = (filter.search ?? "").toLowerCase();
    const matchesSearch =
      (order.order_number ?? "").toLowerCase().includes(search) ||
      (order.customer?.name ?? "").toLowerCase().includes(search) ||
      (order.customer?.email ?? "").toLowerCase().includes(search);

    const matchesStatus =
      filter.status === "all" || (order.status ?? "") === filter.status;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  return [...filteredOrders].sort((a, b) => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    switch (sortConfig.key) {
      case "date":
        return (
          (new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()) *
          direction
        );
      case "total":
        return ((a.amount ?? 0) - (b.amount ?? 0)) * direction;
      case "customer":
        return (
          (a.customer?.name ?? "").localeCompare(b.customer?.name ?? "") *
          direction
        );
      default:
        return 0;
    }
  });
};
