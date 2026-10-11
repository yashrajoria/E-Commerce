export type {
  Product,
  Category,
  Customer,
  Address,
  OrderItem,
  OrderStatus,
} from "@ecommerce/shared";

export type ID = string;

export interface Order {
  _id?: string;
  order_number?: string;
  customer?: import("@ecommerce/shared").Customer;
  date?: string;
  amount?: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  items?: import("@ecommerce/shared").OrderItem[] | number;
  status?: import("@ecommerce/shared").OrderStatus;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: import("@ecommerce/shared").Address | string;
  billingAddress?: import("@ecommerce/shared").Address;
  trackingNumber?: string;
  notes?: string;
  id?: string;
  user_id?: string;
  CreatedAt?: string;
  updatedAt?: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface OrdersFilter {
  search?: string;
  status?: import("@ecommerce/shared").OrderStatus | "all";
}
