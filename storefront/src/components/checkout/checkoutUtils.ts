import { formatGBP } from "@/lib/utils";

export { formatGBP };

/* ─── Validation helpers ─── */
/** Pattern accepting any non-whitespace local part followed by `@`, a domain and a dotted TLD. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Pattern accepting 7–18 digits with an optional leading `+` and no spaces or brackets. */
export const PHONE_RE = /^[+]?[^\s()-]{7,18}$/;

/**
 * Validates a single shipping field and returns its error message.
 *
 * @param name - Field name to validate; unknown names are treated as valid.
 * @param value - Raw field value; trailing whitespace is ignored.
 * @returns The error message to display, or an empty string when the value is acceptable.
 */
export function validateField(name: string, value: string): string {
  const v = value.trim();
  switch (name) {
    case "email":
      if (!v) return "We need this to send your order confirmation";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address";
      return "";
    case "phone":
      if (!v) return "We need this for delivery updates";
      if (!PHONE_RE.test(v)) return "Please enter a valid phone number";
      return "";
    case "firstName":
      if (!v) return "We need your first name to deliver your order";
      return "";
    case "lastName":
      if (!v) return "We need your last name to deliver your order";
      return "";
    case "address":
      if (!v) return "We need this to deliver your order";
      return "";
    case "city":
      if (!v) return "Please enter your city";
      return "";
    case "state":
      if (!v) return "Please enter your state or county";
      return "";
    case "zipCode":
      if (!v) return "Check your postcode format (e.g., SW1A 1AA)";
      return "";
    default:
      return "";
  }
}

/* ─── Delivery date estimation ─── */
/**
 * Estimates the arrival date for a delivery taking the given number of days.
 *
 * @param days - Transit time in days, counted from today.
 * @returns The estimated arrival date formatted for a UK audience, e.g. `"Friday, 24 Oct"`.
 */
export function getDeliveryDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/* ─── Simple debounce utility (local replacement for lodash.debounce) ─── */
/**
 * Wraps a function so it only runs after `wait` milliseconds of silence.
 *
 * @param fn - Function to debounce; called with the arguments of the last invocation.
 * @param wait - Delay in milliseconds before the trailing call, defaults to `0`.
 * @returns The debounced function, augmented with a `cancel` method that discards any pending call.
 * @remarks
 * Local replacement for `lodash.debounce`, used by {@link useCheckout} to throttle draft persistence.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait = 0,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer as ReturnType<typeof setTimeout>);
    timer = setTimeout(() => {
      // cast is safe here — we call the provided function with the original args
      (fn as (...a: unknown[]) => unknown)(...args);
      timer = null;
    }, wait);
  };

  const result = debounced as T & { cancel: () => void };
  result.cancel = () => {
    if (timer) {
      clearTimeout(timer as ReturnType<typeof setTimeout>);
      timer = null;
    }
  };

  return result;
}
