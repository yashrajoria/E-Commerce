/**
 * Sparkline – Miniature inline chart for KPI cards
 * Renders a smooth SVG path with gradient fill
 */
import { useMemo } from "react";

/** Props accepted by {@link Sparkline}. */
interface SparklineProps {
  /** Series of values to plot; values are scaled to the chart height. */
  data: number[];
  /**
   * Stroke colour of the line and base colour of the gradient fill.
   *
   * @defaultValue "#8b5cf6"
   */
  color?: string;
  /**
   * Rendered width of the SVG in pixels.
   *
   * @defaultValue 120
   */
  width?: number;
  /**
   * Rendered height of the SVG in pixels.
   *
   * @defaultValue 40
   */
  height?: number;
  /**
   * Thickness of the line stroke.
   *
   * @defaultValue 2
   */
  strokeWidth?: number;
  /**
   * Custom className.
   *
   * @defaultValue ""
   */
  className?: string;
  /**
   * Unique gradient id to avoid conflicts when multiple sparklines render.
   *
   * @defaultValue "sparkline"
   */
  id?: string;
}

/**
 * Renders a miniature SVG line chart with a soft gradient fill for KPI cards.
 *
 * @remarks
 * Server Component — no `"use client"` directive; the path is derived from props with `useMemo` and renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * <Sparkline id="revenue-spark" data={[12, 18, 15, 24, 31]} color="#10b981" />
 * ```
 */
export function Sparkline({
  data,
  color = "#8b5cf6",
  width = 120,
  height = 40,
  strokeWidth = 2,
  className = "",
  id = "sparkline",
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const padding = 4;

    const points = data.map((val, i) => ({
      x: i * step,
      y: padding + (1 - (val - min) / range) * (height - padding * 2),
    }));

    // Create smooth curve using cubic bezier
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path) return "";
    return `${path} L ${width} ${height} L 0 ${height} Z`;
  }, [path, width, height]);

  const gradientId = `${id}-gradient`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
