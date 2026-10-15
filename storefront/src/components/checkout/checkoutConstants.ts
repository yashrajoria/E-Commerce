import { Mail, MapPin, Truck, CreditCard } from "lucide-react";
import { StepId } from "./checkoutTypes";

/**
 * Metadata for the four checkout wizard steps, in display order.
 *
 * @remarks
 * Consumed by {@link useCheckout} to announce step changes and by the checkout page to render the step label.
 */
export const STEP_META: {
  /** One-based step identifier. */
  id: StepId;
  /** Human-readable step label shown in the progress header. */
  label: string;
  /** Lucide icon component rendered next to the step summary. */
  icon: React.ElementType;
}[] = [
  { id: 1, label: "Contact", icon: Mail },
  { id: 2, label: "Shipping", icon: MapPin },
  { id: 3, label: "Delivery", icon: Truck },
  { id: 4, label: "Review", icon: CreditCard },
];

/** A selectable delivery speed offered during checkout. */
export interface ShippingOption {
  /** Stable identifier also sent to the API as `shipping_method`. */
  id: string;
  /** Display name of the option. */
  label: string;
  /** Estimated transit time, e.g. `"2–3 business days"`. */
  time: string;
  /** Short supporting description shown under the label. */
  sub: string;
  /** Price in major currency units (GBP). */
  price: number;
  /** Transit time in days, used by {@link getDeliveryDate} for the arrival estimate. */
  days: number;
  /** Optional highlight badge, e.g. `"Popular"`. */
  badge?: string;
}

/**
 * Delivery methods rendered by {@link StepDelivery} and {@link InlineEditPanels}.
 *
 * @remarks
 * The `price` values must stay in sync with the shipping calculation in {@link useCheckout} (`5.99` standard, `15.99` express).
 */
export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    time: "5–7 business days",
    sub: "Tracked delivery",
    price: 5.99,
    days: 7,
  },
  {
    id: "express",
    label: "Express Shipping",
    time: "2–3 business days",
    sub: "Next-day for orders before 2pm",
    price: 15.99,
    days: 3,
    badge: "Popular",
  },
];

/**
 * Framer Motion variants producing the horizontal slide between checkout steps.
 *
 * @remarks
 * Each variant is a function of the transition `dir` passed through the `custom` prop: `1` slides in from the right, `-1` from the left.
 */
export const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
};
