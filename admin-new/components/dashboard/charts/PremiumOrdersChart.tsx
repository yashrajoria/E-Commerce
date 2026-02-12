/**
 * PremiumOrdersChart – Enhanced bar chart with gradient bars,
 * comparison overlays, and interactive tooltips
 */
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

interface OrderData {
  name: string;
  orders: number;
  prevOrders: number;
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

  const current = payload[0]?.value as number;
  const prev = payload[1]?.value as number;
  const change = prev > 0 ? ((current - prev) / prev) * 100 : 0;

  return (
    <div className="glass-effect-strong rounded-xl p-4 min-w-[160px] border border-white/10">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
          <span className="text-sm font-bold text-foreground">{current}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-xs text-muted-foreground">Previous</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {prev}
          </span>
        </div>
        <div className="border-t border-white/10 pt-1.5">
          <span
            className={`text-xs font-semibold ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
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

export default function PremiumOrdersChart() {
  const [period, setPeriod] = useState<Period>("weekly");
  const data = period === "weekly" ? weeklyData : monthlyData;

  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const avgOrders = Math.round(totalOrders / data.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="glass-effect border-gradient overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center">
                  <ShoppingCart className="h-3.5 w-3.5 text-white" />
                </div>
                Orders Analytics
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalOrders.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-lg font-semibold text-violet-400">
                    {avgOrders}
                  </p>
                  <p className="text-xs text-muted-foreground">Daily Avg</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <TrendingUp size={12} />
                  +5.2%
                </div>
              </div>
            </div>
            <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
              {(["weekly", "monthly"] as Period[]).map((p) => (
                <Button
                  key={p}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className={
                    period === p
                      ? "bg-primary/15 text-primary hover:bg-primary/20 text-xs h-7 px-3"
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
              data={data}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient
                  id="premBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(139, 92, 246, 0.05)" }}
              />
              <Bar
                dataKey="prevOrders"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
                fill="rgba(148, 163, 184, 0.1)"
              />
              <Bar
                dataKey="orders"
                radius={[6, 6, 0, 0]}
                maxBarSize={24}
                fill="url(#premBarGradient)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
