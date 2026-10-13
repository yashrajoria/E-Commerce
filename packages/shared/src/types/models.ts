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
  store_id?: string;
}

export interface Category {
  id?: string;
  _id?: string;
  name?: string;
  icon?: string;
  image?: string;
  store_id?: string;
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
  store_id?: string;
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

export type StoreRole = "owner" | "admin" | "manager" | "viewer";

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  currency: string;
  timezone: string;
  domain?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  settings?: StoreSettings;
  subscription?: StoreSubscription;
}

export interface StoreMembership {
  id: string;
  user_id: string;
  store_id: string;
  role: StoreRole;
  invited_by?: string;
  accepted: boolean;
  created_at: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  store?: Store;
}

export interface StoreSettings {
  store_id: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  smtp_host?: string;
  smtp_port?: number;
  maintenance_mode: boolean;
  analytics_enabled: boolean;
  shipping_config?: Record<string, any>;
  payment_config?: Record<string, any>;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  is_active: boolean;
  entitlements?: PlanEntitlement[];
}

export interface PlanEntitlement {
  id: string;
  plan_id: string;
  feature_key: string;
  limit_value?: number | null;
  quota_limit?: number | null;
  enabled: boolean;
}

export interface StoreSubscription {
  id: string;
  store_id: string;
  plan_id: string;
  status: "active" | "past_due" | "cancelled" | "expired" | "trialing";
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  plan?: Plan;
}
