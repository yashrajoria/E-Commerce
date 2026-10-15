import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves conflicting Tailwind CSS utilities.
 *
 * @remarks
 * `clsx` flattens the conditional inputs, then `tailwind-merge` drops earlier
 * utilities that conflict with later ones. This makes the pattern
 * `cn(baseClasses, className)` safe: a `className` supplied by the caller always
 * overrides the component's base styling instead of being appended after it.
 *
 * @param inputs - Any number of `clsx`-compatible class values (strings, arrays, objects, falsy values).
 * @returns The merged class name string with conflicting utilities resolved in favour of the last occurrence.
 *
 * @example
 * ```ts
 * cn("px-2", isActive && "opacity-50", "px-4");
 * // isActive === true  -> "opacity-50 px-4"
 * // isActive === false -> "px-4"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
