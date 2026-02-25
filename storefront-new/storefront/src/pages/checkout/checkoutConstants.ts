import { Mail, MapPin, Truck, CreditCard } from "lucide-react";
import { StepId } from "./checkoutTypes";

export const STEP_META: {
  id: StepId;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: 1, label: "Contact", icon: Mail },
  { id: 2, label: "Shipping", icon: MapPin },
  { id: 3, label: "Delivery", icon: Truck },
  { id: 4, label: "Review", icon: CreditCard },
];

export interface ShippingOption {
  id: string;
  label: string;
  time: string;
  sub: string;
  price: number;
  days: number;
  badge?: string;
}

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

export const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
};
