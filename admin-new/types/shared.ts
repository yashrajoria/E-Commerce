export interface Product {
  _id?: string;
  id?: string;
  name?: string;
  category?: string;
  category_ids?: string[];
  price?: number;
  quantity?: number;
  status?: string;
  images?: string[];
  description?: string;
  brand?: string;
  is_featured?: boolean;
  compareAtPrice?: number;
  totalSales?: number;
  views?: number | string;
  sku?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name?: string;
}

export type ID = string;

// Orders
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Customer {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface OrderItem {
  _id?: string;
  name?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface Order {
  _id?: string;
  order_number?: string;
  customer?: Customer;
  date?: string;
  amount?: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  items?: OrderItem[] | number;
  status?: OrderStatus;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: Address | string;
  billingAddress?: Address;
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
  status?: OrderStatus | "all";
}
