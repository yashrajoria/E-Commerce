/**
 * AnimatedCounter – Premium number counter with smooth animation
 * Counts up from 0 to the target value with easing
 */
import { useEffect, useRef, useState, useCallback } from "react";

/** Props accepted by {@link AnimatedCounter}. */
interface AnimatedCounterProps {
  /** Target value to count to. */
  value: number;
  /**
   * Duration of animation in ms.
   *
   * @defaultValue 1200
   */
  duration?: number;
  /**
   * Prefix string (e.g. "$").
   *
   * @defaultValue ""
   */
  prefix?: string;
  /**
   * Suffix string (e.g. "%").
   *
   * @defaultValue ""
   */
  suffix?: string;
  /**
   * Number of decimal places.
   *
   * @defaultValue 0
   */
  decimals?: number;
  /**
   * Custom className.
   *
   * @defaultValue ""
   */
  className?: string;
  /**
   * Whether to format with commas.
   *
   * @defaultValue true
   */
  formatNumber?: boolean;
}

/**
 * Renders a number that eases from its previous value to `value` on every change.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Used inside a KPI card to animate revenue totals.
 * <AnimatedCounter value={128450.5} prefix="$" decimals={2} />
 * ```
 */
export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  formatNumber = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const prevValue = useRef(0);

  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current =
        prevValue.current + (value - prevValue.current) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [value, duration],
  );

  useEffect(() => {
    startRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      prevValue.current = displayValue;
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animate]);

  const formatted = formatNumber
    ? displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
