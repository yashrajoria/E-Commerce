/** A product line inside a curated shopper bundle. */
export interface BundleItem {
  /** Product identifier, reused as the cart line id when the bundle is added. */
  id: string;
  /** Backend document id, present when the catalog API returns one. */
  _id?: string;
  /** Display name of the product. */
  name: string;
  /** Unit price in integer cents. */
  price: number;
  /** Product image URLs; the first entry is used for the thumbnail. */
  images?: string[];
  /** Product brand shown under the item name. */
  brand?: string;
  /** Stock-keeping unit shown under the item name. */
  sku?: string;
  /** Category breadcrumb supplied by the catalog API. */
  category_path?: string[];
  /** Product description carried through from the catalog. */
  description?: string;
  /** Requested quantity for the bundle line. */
  quantity?: number;
}

/** An assistant-generated action card holding a curated product bundle. */
export interface ActionCard {
  /** Card kind; only `"bundle"` cards are rendered by the shopper widget. */
  type: string;
  /** Headline shown at the top of the card. */
  title: string;
  /** Optional theme label, shown uppercased in the card badge. */
  theme?: string;
  /** Target budget for the bundle in integer cents. */
  budget_cents: number;
  /** Discounted bundle price in integer cents. */
  bundle_price_cents: number;
  /** Pre-discount bundle total in integer cents. */
  original_price_cents: number;
  /** Coupon discount amount in integer cents. */
  discount_cents: number;
  /** Promo code applied to the bundle; stored as the saved coupon when the bundle is added. */
  coupon_code: string;
  /** Total savings highlighted to the shopper, in integer cents. */
  savings_cents: number;
  /** Products included in the bundle. */
  items: BundleItem[];
}

/** A single chat turn exchanged with the shopper assistant. */
export interface Message {
  /** Unique message identifier, also used to key per-message bundle selections. */
  id: string;
  /** Author of the message. */
  sender: "user" | "assistant";
  /** Message body rendered inside the chat bubble. */
  text: string;
  /** Progress labels surfaced while the assistant curates a reply. */
  steps?: string[];
  /** Bundle card attached to the reply, when the assistant returned one. */
  actionCard?: ActionCard;
  /** Creation timestamp used for ordering. */
  timestamp: Date;
}

/**
 * Suggested first prompts shown as chips before the shopper has sent two messages.
 *
 * @remarks
 * Each entry pairs a chip label with the prompt text submitted to the assistant.
 */
export const STARTER_PROMPTS = [
  {
    label: "🖥️ Home office desk setup under $300",
    prompt: "Build me a home office desk bundle under $300",
  },
  {
    label: "🏃 Weekend running kit under $150",
    prompt: "Curate a running and fitness bundle under $150",
  },
  {
    label: "🍵 Tea & focus corner under $80",
    prompt: "Curate an artisan tea and relaxing desk setup under $80",
  },
  {
    label: "✨ Best available store discount?",
    prompt: "What is the best discount coupon code right now?",
  },
];
