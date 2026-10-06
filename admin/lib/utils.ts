import {
  cn,
  formatDate,
  formatINR as formatCurrency,
} from "@ecommerce/shared";

export { cn, formatCurrency, formatDate };

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "3 months ago" / "yesterday" — pairs with `formatDate` for table cells. */
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
