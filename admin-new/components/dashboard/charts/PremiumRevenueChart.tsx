/**
 * PremiumRevenueChart – Enhanced area chart with premium styling,
 * animated gradients, interactive tooltips, and period switching
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

interface RevenueData {
  name: string;
  revenue: number;
  profit: number;
  expenses: number;
}

const monthlyData: RevenueData[] = [
  { name: "Jan", revenue: 18500, profit: 8400, expenses: 10100 },
  { name: "Feb", revenue: 22000, profit: 10200, expenses: 11800 },
  { name: "Mar", revenue: 28000, profit: 14000, expenses: 14000 },
  { name: "Apr", revenue: 32000, profit: 16800, expenses: 15200 },
  { name: "May", revenue: 29500, profit: 15200, expenses: 14300 },
  { name: "Jun", revenue: 36000, profit: 19500, expenses: 16500 },
  { name: "Jul", revenue: 42000, profit: 23100, expenses: 18900 },
  { name: "Aug", revenue: 38000, profit: 20400, expenses: 17600 },
  { name: "Sep", revenue: 45000, profit: 25200, expenses: 19800 },
  { name: "Oct", revenue: 48000, profit: 27600, expenses: 20400 },
  { name: "Nov", revenue: 52000, profit: 30800, expenses: 21200 },
  { name: "Dec", revenue: 58000, profit: 35400, expenses: 22600 },
];

const weeklyData: RevenueData[] = [
  { name: "Mon", revenue: 6200, profit: 3200, expenses: 3000 },
  { name: "Tue", revenue: 7800, profit: 4100, expenses: 3700 },
  { name: "Wed", revenue: 8100, profit: 4400, expenses: 3700 },
  { name: "Thu", revenue: 7200, profit: 3800, expenses: 3400 },
  { name: "Fri", revenue: 9600, profit: 5200, expenses: 4400 },
  { name: "Sat", revenue: 8200, profit: 4500, expenses: 3700 },
  { name: "Sun", revenue: 5800, profit: 3000, expenses: 2800 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-effect-strong rounded-xl p-4 min-w-[180px] border border-white/10">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {formatCurrency(payload[0]?.value as number)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Profit</span>
          </div>
          <span className="text-sm font-bold text-emerald-400">
            {formatCurrency(payload[1]?.value as number)}
          </span>
        </div>
      </div>
    </div>
  );
};

type Period = "weekly" | "monthly";

export default function PremiumRevenueChart() {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = period === "monthly" ? monthlyData : weeklyData;

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-effect border-gradient overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
                  <DollarSign className="h-3.5 w-3.5 text-white" />
                </div>
                Revenue Overview
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatCurrency(totalProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground">Net Profit</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <TrendingUp size={12} />
                  +12.5%
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
            <AreaChart
              data={data}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="premRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="premProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#10b981" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
                tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "rgba(139, 92, 246, 0.2)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#premRevenue)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#8b5cf6",
                  stroke: "#1e1b4b",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#premProfit)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#10b981",
                  stroke: "#064e3b",
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
