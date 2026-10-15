/**
 * Utility helpers for consistent patterns
 * Provides common functions used across the application
 */

import type {
  UploadedImage,
  CSVRecord,
  FormErrors,
  ApiResponse,
} from '@ecommerce/shared/src/types/common';

/**
 * Formats a numeric amount as a currency string for display.
 *
 * @param amount - Amount in major units.
 * @param currency - ISO 4217 currency code. Defaults to `'USD'`.
 * @returns The formatted string in the `en-US` locale, e.g. `"$1,240.00"`.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a ratio as a percentage string.
 *
 * @param value - Ratio to format, e.g. `0.42` for 42%.
 * @param decimals - Number of decimal places to keep. Defaults to `1`.
 * @returns The formatted percentage, e.g. `"42.0%"`.
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Parses a CSV file into header-keyed records.
 *
 * @remarks
 * The first line supplies the headers and numeric-looking values are coerced
 * to numbers. Parse failures are reported through `error` rather than thrown.
 *
 * @param file - CSV file selected by the user.
 * @returns A promise resolving to the parsed records, plus an `error` message when parsing failed.
 */
export async function parseCSV(
  file: File
): Promise<{ records: CSVRecord[]; error?: string }> {
  try {
    const text = await file.text();
    const lines = text.split('\n').filter((line) => line.trim());
    const headers = lines[0].split(',').map((h) => h.trim());

    const records: CSVRecord[] = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const record: CSVRecord = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number
        record[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return record;
    });

    return { records };
  } catch (error) {
    return {
      records: [],
      error: error instanceof Error ? error.message : 'Failed to parse CSV',
    };
  }
}

/**
 * Validates an image file's MIME type and size.
 *
 * @param file - File to check.
 * @param maxSizeMB - Maximum allowed size in megabytes. Defaults to `10`.
 * @returns `{ valid: true }`, or `{ valid: false, error }` describing the failed check.
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Retries an async operation with exponential backoff.
 *
 * @param fn - Operation to attempt; invoked again after each failure.
 * @param maxRetries - Maximum number of attempts. Defaults to `3`.
 * @param baseDelay - Delay before the first retry in milliseconds, doubling after each failure. Defaults to `1000`.
 * @returns A promise resolving with the first successful result.
 * @throws {@link Error} The error from the final attempt when every retry fails.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Recursively merges a partial source into a target object.
 *
 * @remarks
 * Nested plain objects are merged key by key; arrays and non-object values
 * are replaced by the source value.
 *
 * @param target - Base object; not mutated.
 * @param source - Partial overrides to apply.
 * @returns A new object combining `target` and `source`.
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = output[key as keyof T];
    const sourceValue = source[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object'
    ) {
      output[key as keyof T] = deepMerge(
        targetValue as object,
        sourceValue as object
      ) as T[keyof T];
    } else {
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return output;
}

/**
 * Delays a function call until input has settled for `wait` milliseconds.
 *
 * @param fn - Function to debounce.
 * @param wait - Quiet period in milliseconds before the call is made.
 * @returns A debounced wrapper; every call restarts the timer.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      fn(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Limits a function to at most one call per `wait` milliseconds.
 *
 * @param fn - Function to throttle.
 * @param wait - Minimum interval between calls in milliseconds.
 * @returns A throttled wrapper that fires immediately, then at most once per interval.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      fn(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * Generates a short random identifier.
 *
 * @param prefix - Optional prefix joined with a hyphen (e.g. `"order"` gives `"order-1a2b3c4d5"`). Defaults to `''`.
 * @returns The generated identifier.
 */
export function generateId(prefix: string = ''): string {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Parses a JSON string without throwing.
 *
 * @param json - JSON string to parse.
 * @param fallback - Value returned when parsing throws.
 * @returns The parsed value, or `fallback`.
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Reads a nested property by dot-separated path.
 *
 * @param obj - Object to read from.
 * @param path - Dot-separated key path, e.g. `"user.profile.name"`.
 * @param defaultValue - Value returned when any segment is missing. Defaults to `undefined`.
 * @returns The resolved value, or `defaultValue`.
 */
export function getNestedValue(
  obj: any,
  path: string,
  defaultValue: any = undefined
): any {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}

/**
 * Shortens text to a maximum length, appending an ellipsis.
 *
 * @param text - Text to shorten.
 * @param maxLength - Maximum number of characters kept before the ellipsis.
 * @returns The original text when it already fits, otherwise the truncated text plus `"..."`.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

/**
 * Narrows an API response envelope to one that carries a payload.
 *
 * @param response - Response envelope to test.
 * @returns `true` when `success` is `true` and `data` is set, narrowing the type so `data` is available.
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined;
}

/**
 * Formats a byte count as a human-readable file size.
 *
 * @param bytes - Size in bytes.
 * @returns The formatted size with a unit, e.g. `"1.5 MB"`.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Describes how long ago a date occurred.
 *
 * @param date - Date instance or parseable date string.
 * @returns A label such as `"just now"` or `"5 minutes ago"`; anything older than roughly a month is formatted as a locale date string.
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const time = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - time.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

  return time.toLocaleDateString();
}
