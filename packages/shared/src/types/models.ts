/**
 * Unified Domain Models for ShopSwift
 * Shared between Storefront (customer workflows) and Admin (catalog management).
 */

export interface Product {
  id?: string;
  _id?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  compareAtPrice?: number;
  images?: string[];
  description?: string;
  rating?: number;
  reviews?: number;
  category?: string | { id?: string; name: string };
  category_ids?: string[];
  badge?: string;
  quantity?: number;
  inStock?: boolean;
  status?: string;
  brand?: string;
  is_featured?: boolean;
  totalSales?: number;
  views?: number | string;
  sku?: string;
}

export interface Category {
  id?: string;
  _id?: string;
  name?: string;
  icon?: string;
  image?: string;
  productCount?: number;
  directProductCount?: number;
  totalProductCount?: number;
}

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

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id?: string;
  _id?: string;
  name?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  order_number?: string;
  customer?: Customer;
  date?: string;
  amount?: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  status?: OrderStatus | string;
  items?: OrderItem[] | number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  products: Product[];
  layout?: "large" | "medium" | "small";
}
