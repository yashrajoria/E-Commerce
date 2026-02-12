/**
 * AnimatedCounter – Premium number counter with smooth animation
 * Counts up from 0 to the target value with easing
 */
import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCounterProps {
  /** Target value to count to */
  value: number;
  /** Duration of animation in ms */
  duration?: number;
  /** Prefix string (e.g. "$") */
  prefix?: string;
  /** Suffix string (e.g. "%") */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Custom className */
  className?: string;
  /** Whether to format with commas */
  formatNumber?: boolean;
}

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
    [value, duration]
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
