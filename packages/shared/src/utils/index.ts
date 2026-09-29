import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null, fallback = "N/A") {
  if (!dateString) return fallback;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type CurrencyOptions = {
  currency?: string;
  locale?: string;
};

export function formatCurrency(
  value?: number,
  { currency = "USD", locale = "en-US" }: CurrencyOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value ?? 0);
}

export function formatGBP(value?: number) {
  return formatCurrency(value, { currency: "GBP", locale: "en-GB" });
}

export function formatINR(value?: number) {
  return formatCurrency(value, { currency: "INR", locale: "en-US" });
}

export function trapFocus(container: HTMLElement | null, e: KeyboardEvent) {
  const focusable = Array.from(
    container?.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? [],
  );

  if (focusable.length === 0) {
    e.preventDefault();
    return;
  }

  const idx = focusable.indexOf(document.activeElement as HTMLElement);
  if (e.shiftKey) {
    if (idx === 0) {
      focusable[focusable.length - 1].focus();
      e.preventDefault();
    }
    return;
  }

  if (idx === focusable.length - 1) {
    focusable[0].focus();
    e.preventDefault();
  }
}
