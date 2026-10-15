/**
 * PremiumRevenueChart – Operational revenue chart with ShopSwift visual system,
 * clean typography, clear axis metrics, and interactive tooltips
 */
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

/** A single period's revenue, profit and expense figures. */
interface RevenueData {
  /** Period label, e.g. `"Jan"` or `"Mon"`. */
  name: string;
  /** Gross revenue for the period. */
  revenue: number;
  /** Net profit for the period. */
  profit: number;
  /** Expenses for the period. */
  expenses: number;
}

/** Props accepted by {@link PremiumRevenueChart}. */
interface PremiumRevenueChartProps {
  /** Revenue series per period, used by the monthly/weekly toggle. */
  data: {
    /** Twelve-month series rendered when the monthly toggle is active. */
    monthly: RevenueData[];
    /** Seven-day series rendered when the weekly toggle is active. */
    weekly: RevenueData[];
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-popover text-popover-foreground rounded-lg p-3 min-w-[170px] border border-border shadow-md">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-[#1f513f]" />
            <span className="text-xs text-muted-foreground font-medium">
              Revenue
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(payload[0]?.value as number)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-[#d97706]" />
            <span className="text-xs text-muted-foreground font-medium">
              Net Profit
            </span>
          </div>
          <span className="text-sm font-semibold text-[#b45309] dark:text-[#f59e0b]">
            {formatCurrency(payload[1]?.value as number)}
          </span>
        </div>
      </div>
    </div>
  );
};

type Period = "weekly" | "monthly";

/**
 * Renders the premium revenue-vs-profit area chart with weekly/monthly toggle
 * and revenue/profit summary metrics.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <PremiumRevenueChart data={dashboardData.revenueCharts} />
 * ```
 */
export default function PremiumRevenueChart({
  data,
}: PremiumRevenueChartProps) {
  const [period, setPeriod] = useState<Period>("monthly");

  if (!data) return null;

  const chartData =
    period === "monthly" ? data.monthly || [] : data.weekly || [];

  const totalRevenue = chartData.reduce(
    (sum: number, d: RevenueData) => sum + d.revenue,
    0,
  );
  const totalProfit = chartData.reduce(
    (sum: number, d: RevenueData) => sum + d.profit,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <Card className="bg-card border border-border shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
                Revenue Overview
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Revenue
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-semibold text-[#b45309] dark:text-[#f59e0b]">
                    {formatCurrency(totalProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Net Profit
                  </p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                  <TrendingUp size={12} />
                  +12.5%
                </div>
              </div>
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-lg border border-border">
              {(["weekly", "monthly"] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className={
                    period === p
                      ? "bg-card text-foreground font-medium shadow-2xs text-xs h-7 px-3 hover:bg-card"
                      : "text-muted-foreground hover:text-foreground text-xs h-7 px-3"
                  }
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 pb-2 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="premRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f513f" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1f513f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="premProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="stroke-border/40"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 11, fontWeight: 500 }}
                className="text-muted-foreground"
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", fontSize: 11 }}
                className="text-muted-foreground"
                tickFormatter={(v) => `£${v >= 1000 ? `${v / 1000}k` : v}`}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1f513f"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#premRevenue)"
                dot={false}
                activeDot={{
                  r: 4.5,
                  fill: "#1f513f",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#d97706"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#premProfit)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#d97706",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
