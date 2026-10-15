/** Re-exported shared domain types (product, category, customer, address, order item, order status). */
export type {
  Product,
  Category,
  Customer,
  Address,
  OrderItem,
  OrderStatus,
} from "@ecommerce/shared";

/** String identifier of a persisted entity. */
export type ID = string;

/** Admin-panel view of an order; most fields are optional because the BFF and service shapes differ. */
export interface Order {
  /** Mongo document id, when the service shape is used. */
  _id?: string;
  /** Human-readable order number, e.g. `SS-10237`. */
  order_number?: string;
  /** Customer that placed the order. */
  customer?: import("@ecommerce/shared").Customer;
  /** ISO timestamp of the order. */
  date?: string;
  /** Order total in major currency units. */
  amount?: number;
  /** Sum of line items before tax, shipping and discounts. */
  subtotal?: number;
  /** Tax charged on the order. */
  tax?: number;
  /** Shipping fee charged on the order. */
  shipping?: number;
  /** Discount amount applied to the order. */
  discount?: number;
  /** Order line items, or the item count when only a number is returned. */
  items?: import("@ecommerce/shared").OrderItem[] | number;
  /** Current fulfillment status. */
  status?: import("@ecommerce/shared").OrderStatus;
  /** Payment method used, e.g. `"card"`. */
  paymentMethod?: string;
  /** Payment provider transaction id. */
  paymentId?: string;
  /** Shipping destination, either structured or as a free-form string. */
  shippingAddress?: import("@ecommerce/shared").Address | string;
  /** Billing address on record. */
  billingAddress?: import("@ecommerce/shared").Address;
  /** Carrier tracking number once the order ships. */
  trackingNumber?: string;
  /** Free-form operator notes attached to the order. */
  notes?: string;
  /** Underlying id used by the checkouts service. */
  id?: string;
  /** Identity-service id of the customer. */
  user_id?: string;
  /** Creation timestamp as returned by the checkouts service (capitalized). */
  CreatedAt?: string;
  /** ISO timestamp of the last order update. */
  updatedAt?: string;
}

/** Column plus direction used to sort an order list. */
export interface SortConfig {
  /** Sort key understood by `filterOrders`, e.g. `"date"`, `"total"`, `"customer"`. */
  key: string;
  /** Sort direction. */
  direction: "asc" | "desc";
}

/** Search and status filters applied to an order list. */
export interface OrdersFilter {
  /** Free-text query matched against order number, customer name and email. */
  search?: string;
  /** Status to filter by, or `"all"` to include every status. */
  status?: import("@ecommerce/shared").OrderStatus | "all";
}
