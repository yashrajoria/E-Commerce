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

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

export function formatRelativeDate(
  dateString?: string | null,
  fallback = "N/A",
) {
  if (!dateString) return fallback;

  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return fallback;

  const delta = timestamp - Date.now();
  const magnitude = Math.abs(delta);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (magnitude >= ms) {
      return formatter.format(Math.round(delta / ms), unit);
    }
  }

  return formatter.format(Math.round(delta / 1000), "second");
}

