import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export interface OrderData {
  name: string;
  orders: number;
  prevOrders: number;
}

export interface PremiumOrdersChartProps {
  data?: {
    weekly?: OrderData[];
    monthly?: OrderData[];
  };
}

const weeklyData: OrderData[] = [
  { name: "Mon", orders: 32, prevOrders: 28 },
  { name: "Tue", orders: 45, prevOrders: 38 },
  { name: "Wed", orders: 38, prevOrders: 42 },
  { name: "Thu", orders: 52, prevOrders: 35 },
  { name: "Fri", orders: 63, prevOrders: 46 },
  { name: "Sat", orders: 48, prevOrders: 40 },
  { name: "Sun", orders: 35, prevOrders: 32 },
];

const monthlyData: OrderData[] = [
  { name: "Jan", orders: 420, prevOrders: 380 },
  { name: "Feb", orders: 480, prevOrders: 410 },
  { name: "Mar", orders: 520, prevOrders: 460 },
  { name: "Apr", orders: 580, prevOrders: 500 },
  { name: "May", orders: 540, prevOrders: 520 },
  { name: "Jun", orders: 620, prevOrders: 560 },
  { name: "Jul", orders: 700, prevOrders: 610 },
  { name: "Aug", orders: 660, prevOrders: 640 },
  { name: "Sep", orders: 740, prevOrders: 680 },
  { name: "Oct", orders: 780, prevOrders: 720 },
  { name: "Nov", orders: 820, prevOrders: 760 },
  { name: "Dec", orders: 900, prevOrders: 800 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const current = payload[1]?.value as number ?? payload[0]?.value as number;
  const prev = payload[0]?.value as number;
  const change = prev > 0 ? ((current - prev) / prev) * 100 : 0;

  return (
    <div className="bg-popover text-popover-foreground rounded-lg p-3 min-w-[160px] border border-border shadow-md">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-[#1f513f]" />
            <span className="text-xs text-muted-foreground font-medium">Current</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{current}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-xs bg-muted-foreground/30" />
            <span className="text-xs text-muted-foreground font-medium">Previous</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {prev}
          </span>
        </div>
        <div className="border-t border-border pt-1.5 mt-1">
          <span
            className={`text-xs font-semibold ${change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}% vs previous
          </span>
        </div>
      </div>
    </div>
  );
};

type Period = "weekly" | "monthly";

export default function PremiumOrdersChart({ data }: PremiumOrdersChartProps = {}) {
  const [period, setPeriod] = useState<Period>("weekly");
  const weekly = data?.weekly && data.weekly.length > 0 ? data.weekly : weeklyData;
  const monthly = data?.monthly && data.monthly.length > 0 ? data.monthly : monthlyData;
  const chartData = period === "weekly" ? weekly : monthly;

  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrders = chartData.length > 0 ? Math.round(totalOrders / chartData.length) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <Card className="bg-card border border-border shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                Orders Analytics
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {totalOrders.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Total Volume</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-semibold text-[#b45309] dark:text-[#f59e0b]">
                    {avgOrders}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Daily Avg</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                  <TrendingUp size={12} />
                  +5.2%
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
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="22%"
            >
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
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              />
              <Bar
                dataKey="prevOrders"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                fill="currentColor"
                className="text-muted/70"
              />
              <Bar
                dataKey="orders"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                fill="#1f513f"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
