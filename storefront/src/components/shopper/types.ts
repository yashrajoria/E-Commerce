export interface BundleItem {
  id: string;
  _id?: string;
  name: string;
  price: number;
  images?: string[];
  brand?: string;
  sku?: string;
  category_path?: string[];
  description?: string;
  quantity?: number;
}

export interface ActionCard {
  type: string;
  title: string;
  theme?: string;
  budget_cents: number;
  bundle_price_cents: number;
  original_price_cents: number;
  discount_cents: number;
  coupon_code: string;
  savings_cents: number;
  items: BundleItem[];
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  steps?: string[];
  actionCard?: ActionCard;
  timestamp: Date;
}

export const STARTER_PROMPTS = [
  { label: "🖥️ Home office desk setup under $300", prompt: "Build me a home office desk bundle under $300" },
  { label: "🏃 Weekend running kit under $150", prompt: "Curate a running and fitness bundle under $150" },
  { label: "🍵 Tea & focus corner under $80", prompt: "Curate an artisan tea and relaxing desk setup under $80" },
  { label: "✨ Best available store discount?", prompt: "What is the best discount coupon code right now?" },
];

