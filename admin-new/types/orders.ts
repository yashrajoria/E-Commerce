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
  avatar: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  order_number: string;
  customer: Customer;
  date: string;
  amount: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  items: OrderItem[] | number;
  status: OrderStatus;
  paymentMethod: string;
  paymentId?: string;
  shippingAddress: Address | string;
  billingAddress?: Address;
  trackingNumber?: string;
  notes?: string;
  id: string;
  user_id: string;
  CreatedAt: string;
  updatedAt: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface OrdersFilter {
  search: string;
  status: OrderStatus | "all";
}
