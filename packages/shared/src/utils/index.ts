import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicting utilities.
 *
 * @param inputs - Class values (strings, arrays or objects) accepted by `clsx`.
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date-time string for display.
 *
 * @param dateString - Date string to format; falsy values return the fallback.
 * @param fallback - Value returned when the input is missing or unparseable. Defaults to `"N/A"`.
 * @returns A compact `en-US` date-time such as `"Jan 5, 2026, 02:30 PM"`, or the fallback.
 */
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

/**
 * Formats a numeric value as currency.
 *
 * @param value - Amount in major units; missing values format as zero.
 * @param options - Currency and locale overrides. Defaults to `USD` in the `en-US` locale.
 * @returns The formatted currency string, e.g. `"$1,240.00"`.
 */
export function formatCurrency(
  value?: number,
  { currency = "USD", locale = "en-US" }: CurrencyOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value ?? 0);
}

/**
 * Formats a numeric value as UK sterling.
 *
 * @remarks
 * Thin wrapper around {@link formatCurrency} with the `GBP` currency and
 * `en-GB` locale.
 *
 * @param value - Amount in pounds; missing values format as zero.
 * @returns The formatted currency string, e.g. `"£1,240.00"`.
 */
export function formatGBP(value?: number) {
  return formatCurrency(value, { currency: "GBP", locale: "en-GB" });
}

/**
 * Formats a numeric value as Indian rupees.
 *
 * @remarks
 * Thin wrapper around {@link formatCurrency} with the `INR` currency.
 *
 * @param value - Amount in rupees; missing values format as zero.
 * @returns The formatted currency string, e.g. `"₹1,240.00"`.
 */
export function formatINR(value?: number) {
  return formatCurrency(value, { currency: "INR", locale: "en-US" });
}

/**
 * Keeps keyboard focus inside a container by wrapping `Tab` and `Shift+Tab`.
 *
 * @remarks
 * Call from a `keydown` handler while an overlay is open. Tabbing forward from
 * the last focusable element jumps to the first, and shift-tabbing from the
 * first jumps to the last.
 *
 * @param container - Element that bounds the focus trap; when `null` or empty of focusable elements, the default action is prevented.
 * @param e - The keydown event whose default behaviour may be prevented.
 * @returns Nothing; focus is moved as a side effect.
 */
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

/**
 * Formats a date as a human-readable relative time.
 *
 * @param dateString - Date string to describe; falsy values return the fallback.
 * @param fallback - Value returned when the input is missing or unparseable. Defaults to `"N/A"`.
 * @returns A relative label such as `"2 hours ago"` or `"in 3 days"`, or the fallback.
 */
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

const SUPABASE_STORAGE_BASE = "https://vtfryikkounwjuyceztn.supabase.co/storage/v1/object/public/shopswift";

/**
 * Resolves a product image URL for rendering.
 *
 * @remarks
 * Blank values fall back to the placeholder. LocalStack URLs
 * (`localhost:4566`/`localstack:4566` under `/shopswift`) are rewritten to the
 * public Supabase Storage bucket so locally seeded data still renders.
 *
 * @param url - Raw image URL stored on the product.
 * @param fallback - Image used when `url` is blank. Defaults to `"/placeholder.svg"`.
 * @returns A renderable image URL.
 */
export function resolveProductImageUrl(url?: string | null, fallback = "/placeholder.svg"): string {
  if (!url || typeof url !== "string" || !url.trim()) return fallback;
  const trimmed = url.trim();

  // If localstack / localhost:4566 URL, rewrite to live Supabase Storage URL
  if (trimmed.includes("localhost:4566/shopswift") || trimmed.includes("localstack:4566/shopswift")) {
    return trimmed.replace(/^https?:\/\/(localhost|localstack):4566\/shopswift/, SUPABASE_STORAGE_BASE);
  }

  return trimmed;
}
