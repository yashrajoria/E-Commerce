/* ─── Currency formatting ─── */
export const formatGBP = (value?: number): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value ?? 0);

/* ─── Validation helpers ─── */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[+]?[^\s()-]{7,18}$/;

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
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 0) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as T & { cancel: () => void };
}
