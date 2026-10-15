/**
 * Unified Domain Models for ShopSwift
 * Shared between Storefront (customer workflows) and Admin (catalog management).
 */

/** Product record shared by the storefront catalogue and admin catalog management. */
export interface Product {
  /** Primary identifier used by the API. */
  id?: string;
  /** Mongo-style identifier supplied by some backend responses. */
  _id?: string;
  /** Product display name. */
  name?: string;
  /** Current selling price. */
  price?: number;
  /** Price before a markdown, when the product is discounted. */
  originalPrice?: number;
  /** Reference price shown beside `price` to indicate a discount. */
  compareAtPrice?: number;
  /** Image URLs; the first is conventionally used as the thumbnail. */
  images?: string[];
  /** Long-form product description. */
  description?: string;
  /** Average customer rating. */
  rating?: number;
  /** Number of customer reviews. */
  reviews?: number;
  /** Category name, or an object carrying the category id and name. */
  category?: string | { id?: string; name: string };
  /** Ids of every category the product belongs to. */
  category_ids?: string[];
  /** Merchandising badge text, e.g. `"New"`. */
  badge?: string;
  /** Units available in stock. */
  quantity?: number;
  /** Whether the product can be purchased. */
  inStock?: boolean;
  /** Listing status supplied by the backend, e.g. `"active"`. */
  status?: string;
  /** Brand or manufacturer name. */
  brand?: string;
  /** Whether the product is promoted as featured. */
  is_featured?: boolean;
  /** Lifetime units sold. */
  totalSales?: number;
  /** View counter; some backends return it as a string. */
  views?: number | string;
  /** Stock-keeping unit code. */
  sku?: string;
  /** Store that owns the catalogue entry (multi-store installs). */
  store_id?: string;
}

/** Catalogue category shared by storefront navigation and admin management. */
export interface Category {
  /** Primary identifier used by the API. */
  id?: string;
  /** Mongo-style identifier supplied by some backend responses. */
  _id?: string;
  /** Category display name. */
  name?: string;
  /** Emoji or icon token used in compact navigation lists. */
  icon?: string;
  /** Cover image URL. */
  image?: string;
  /** Store that owns the category (multi-store installs). */
  store_id?: string;
  /** Number of products shown for the category. */
  productCount?: number;
  /** Number of products assigned directly to this category. */
  directProductCount?: number;
  /** Number of products including those in descendant categories. */
  totalProductCount?: number;
}

/** Customer identity shown on orders and customer lists. */
export interface Customer {
  /** Customer display name. */
  name: string;
  /** Customer email address. */
  email: string;
  /** Contact phone number. */
  phone?: string;
  /** Avatar image URL. */
  avatar?: string;
}

/** Postal address used for shipping or billing. */
export interface Address {
  /** Street line. */
  street?: string;
  /** City or town. */
  city?: string;
  /** State, province or region. */
  state?: string;
  /** ZIP or postal code. */
  zipCode?: string;
  /** Country name or code. */
  country?: string;
}

/**
 * Lifecycle status of an order.
 *
 * @remarks
 * `pending` (placed, not yet processed), `processing`, `shipped`,
 * `delivered` and `cancelled`.
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

/** A single line item within an order. */
export interface OrderItem {
  /** Primary identifier used by the API. */
  id?: string;
  /** Mongo-style identifier supplied by some backend responses. */
  _id?: string;
  /** Product name captured at purchase time. */
  name?: string;
  /** Stock-keeping unit captured at purchase time. */
  sku?: string;
  /** Unit price at purchase time. */
  price?: number;
  /** Units purchased. */
  quantity?: number;
  /** Product image URL. */
  image?: string;
}

/** Order record rendered in the admin and account order views. */
export interface Order {
  /** Primary identifier used by the API. */
  id?: string;
  /** Mongo-style identifier supplied by some backend responses. */
  _id?: string;
  /** Human-readable order reference, e.g. `"ORD-1042"`. */
  order_number?: string;
  /** Customer that placed the order. */
  customer?: Customer;
  /** Store that received the order (multi-store installs). */
  store_id?: string;
  /** Order date string supplied by the backend. */
  date?: string;
  /** Total amount charged. */
  amount?: number;
  /** Items subtotal before tax, shipping and discounts. */
  subtotal?: number;
  /** Tax portion of the total. */
  tax?: number;
  /** Shipping portion of the total. */
  shipping?: number;
  /** Discount applied to the order. */
  discount?: number;
  /** Order lifecycle status; backends may return values beyond {@link OrderStatus}. */
  status?: OrderStatus | string;
  /** Purchased line items, or a summary count when the backend returns a number. */
  items?: OrderItem[] | number;
}

/** A {@link Product} together with the quantity held in the cart. */
export interface CartItem extends Product {
  /** Units of the product in the cart. */
  quantity: number;
}

/** Curated product collection rendered as a storefront section. */
export interface Collection {
  /** Unique collection identifier. */
  id: string;
  /** Heading shown for the collection. */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Cover image URL. */
  image: string;
  /** Products included in the collection. */
  products: Product[];
  /** Relative size hint for grid layouts. */
  layout?: "large" | "medium" | "small";
}

/**
 * Role a user can hold within a store.
 *
 * @remarks
 * Values: `owner` (full control of the store), `admin`, `manager` and
 * `viewer` (read-only access).
 */
export type StoreRole = "owner" | "admin" | "manager" | "viewer";

/** Store record that backs multi-store installs. */
export interface Store {
  /** Unique store identifier. */
  id: string;
  /** Store display name. */
  name: string;
  /** URL-safe identifier used in storefront routes. */
  slug: string;
  /** Public description of the store. */
  description?: string;
  /** Logo image URL. */
  logo_url?: string;
  /** Default currency code (ISO 4217). */
  currency: string;
  /** IANA timezone identifier. */
  timezone: string;
  /** Custom domain serving the storefront, when configured. */
  domain?: string;
  /** Whether the store is live. */
  is_active: boolean;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of the last update. */
  updated_at: string;
  /** Store-level settings, loaded separately. */
  settings?: StoreSettings;
  /** Billing subscription for the store. */
  subscription?: StoreSubscription;
}

/** Links a user to a store with a specific role. */
export interface StoreMembership {
  /** Unique membership identifier. */
  id: string;
  /** Member user identifier. */
  user_id: string;
  /** Store the user belongs to. */
  store_id: string;
  /** Role granted to the user. */
  role: StoreRole;
  /** Inviter's user identifier, when the membership came from an invite. */
  invited_by?: string;
  /** Whether the invitation has been accepted. */
  accepted: boolean;
  /** ISO timestamp of creation. */
  created_at: string;
  /** Embedded member details when the API includes them. */
  user?: {
    /** Member user identifier. */
    id: string;
    /** Member email address. */
    email: string;
    /** Member display name. */
    name: string;
  };
  /** Embedded store details when the API includes them. */
  store?: Store;
}

/** Per-store settings managed in the admin settings area. */
export interface StoreSettings {
  /** Store these settings belong to. */
  store_id: string;
  /** Public contact email. */
  contact_email?: string;
  /** Public contact phone number. */
  contact_phone?: string;
  /** Physical or mailing address. */
  address?: string;
  /** Outbound SMTP host for store emails. */
  smtp_host?: string;
  /** Outbound SMTP port. */
  smtp_port?: number;
  /** Whether the storefront is in maintenance mode. */
  maintenance_mode: boolean;
  /** Whether traffic analytics collection is enabled. */
  analytics_enabled: boolean;
  /** Shipping rules; backend-defined shape. */
  shipping_config?: Record<string, any>;
  /** Payment provider credentials and options; backend-defined shape. */
  payment_config?: Record<string, any>;
}

/** Subscription plan available to stores. */
export interface Plan {
  /** Unique plan identifier. */
  id: string;
  /** Plan display name. */
  name: string;
  /** URL-safe plan identifier. */
  slug: string;
  /** Monthly price in `currency`. */
  price_monthly: number;
  /** Yearly price in `currency`. */
  price_yearly: number;
  /** Currency code the prices are quoted in. */
  currency: string;
  /** Whether the plan can be subscribed to. */
  is_active: boolean;
  /** Feature entitlements granted by the plan. */
  entitlements?: PlanEntitlement[];
}

/** A single feature grant attached to a plan. */
export interface PlanEntitlement {
  /** Unique entitlement identifier. */
  id: string;
  /** Plan that grants the entitlement. */
  plan_id: string;
  /** Feature key the entitlement controls. */
  feature_key: string;
  /** Numeric limit configured for the feature; `null` when unlimited. */
  limit_value?: number | null;
  /** Quota applied to the feature, when the plan defines one. */
  quota_limit?: number | null;
  /** Whether the feature is switched on for the plan. */
  enabled: boolean;
}

/** Billing subscription linking a store to a plan. */
export interface StoreSubscription {
  /** Unique subscription identifier. */
  id: string;
  /** Store the subscription belongs to. */
  store_id: string;
  /** Plan the store is subscribed to. */
  plan_id: string;
  /** Current lifecycle state of the subscription. */
  status: "active" | "past_due" | "cancelled" | "expired" | "trialing";
  /** Stripe subscription id, when billed through Stripe. */
  stripe_subscription_id?: string;
  /** Stripe customer id, when billed through Stripe. */
  stripe_customer_id?: string;
  /** ISO timestamp for the start of the current billing period. */
  current_period_start?: string;
  /** ISO timestamp for the end of the current billing period. */
  current_period_end?: string;
  /** Whether the subscription ends at the close of the current period. */
  cancel_at_period_end: boolean;
  /** Embedded plan details when the API includes them. */
  plan?: Plan;
}
