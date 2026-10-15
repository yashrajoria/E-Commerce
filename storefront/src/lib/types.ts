import type {
  Product as BaseProduct,
  Category as BaseCategory,
  Collection as BaseCollection,
} from "@ecommerce/shared";

/**
 * Storefront product view model, extending the shared product shape with the
 * fields the storefront UI relies on directly.
 */
export interface Product extends BaseProduct {
  /** Unique product identifier. */
  id: string;
  /** Display name shown across catalog, product, and cart surfaces. */
  name: string;
  /** Current selling price in major currency units. */
  price: number;
  /** Ordered image URLs; the first entry is used as the thumbnail. */
  images: string[];
}

/**
 * Storefront category view model used by the catalog filter sidebar and the
 * category landing page.
 */
export interface Category extends BaseCategory {
  /** Unique category identifier. */
  id: string;
  /** Display name of the category. */
  name: string;
  /** Lucide icon name resolved by {@link getLucideIcon}. */
  icon: string;
  /** Banner or thumbnail image URL for the category. */
  image: string;
  /** Number of products assigned to the category (including descendants). */
  productCount: number;
}

/**
 * Subscription purchase configuration selected on the product page.
 */
export interface SubscriptionPlanOption {
  /** Whether the customer opted into a recurring subscription. */
  isSubscription: boolean;
  /** Delivery cadence for the subscription. */
  frequency: "2_weeks" | "4_weeks" | "8_weeks";
  /** Percentage discount applied to each recurring order. */
  discountPercent: number;
}

/**
 * Cart line item combining a product with its quantity and optional
 * subscription plan.
 */
export interface CartItem extends Product {
  /** Number of units of the product in the cart. */
  quantity: number;
  /** Subscription plan for the line item, when the customer subscribed. */
  subscription?: SubscriptionPlanOption;
}

/**
 * Storefront collection view model, narrowing the shared collection's
 * products to the storefront {@link Product} shape.
 */
export interface Collection extends Omit<BaseCollection, "products"> {
  /** Products featured in the collection. */
  products: Product[];
}

export type {
  Customer,
  Address,
  Order,
  OrderItem,
  OrderStatus,
} from "@ecommerce/shared";
