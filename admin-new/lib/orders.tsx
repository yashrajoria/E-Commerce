import { Clock, RefreshCw, Truck, CheckCircle, XCircle } from "lucide-react";
import { OrderStatus, Order, SortConfig, OrdersFilter } from "@/types/orders";

// Status icons mapping
export const statusIcons = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  processing: <RefreshCw className="h-4 w-4 text-blue-400" />,
  shipped: <Truck className="h-4 w-4 text-violet-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  cancelled: <XCircle className="h-4 w-4 text-rose-500" />,
};

// Status badge styling
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

// Format date helper
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Filter and sort orders
export const filterOrders = (
  orders: Order[],
  filter: OrdersFilter,
  sortConfig: SortConfig
) => {
  let filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(filter.search.toLowerCase());

    const matchesStatus =
      filter.status === "all" || order.status === filter.status;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  return [...filteredOrders].sort((a, b) => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    switch (sortConfig.key) {
      case "date":
        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
        );
      case "total":
        return (a.total - b.total) * direction;
      case "customer":
        return a.customer.name.localeCompare(b.customer.name) * direction;
      default:
        return 0;
    }
  });
};
