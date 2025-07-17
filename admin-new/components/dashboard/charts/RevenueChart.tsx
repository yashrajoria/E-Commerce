import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

// Types
interface RevenueData {
  name: string;
  revenue: number;
  profit: number;
}

// Sample data - replace with API data in production
const monthlyData: RevenueData[] = [
  { name: "Jan", revenue: 4000, profit: 2400 },
  { name: "Feb", revenue: 3000, profit: 1398 },
  { name: "Mar", revenue: 5000, profit: 3000 },
  { name: "Apr", revenue: 8000, profit: 3908 },
  { name: "May", revenue: 7000, profit: 4800 },
  { name: "Jun", revenue: 9000, profit: 5000 },
  { name: "Jul", revenue: 12000, profit: 6300 },
  { name: "Aug", revenue: 10000, profit: 5500 },
  { name: "Sep", revenue: 14000, profit: 8000 },
  { name: "Oct", revenue: 13000, profit: 7300 },
  { name: "Nov", revenue: 18000, profit: 9600 },
  { name: "Dec", revenue: 22000, profit: 11800 },
];

const weeklyData: RevenueData[] = [
  { name: "Mon", revenue: 2200, profit: 1200 },
  { name: "Tue", revenue: 2800, profit: 1600 },
  { name: "Wed", revenue: 3100, profit: 1800 },
  { name: "Thu", revenue: 2900, profit: 1500 },
  { name: "Fri", revenue: 3600, profit: 2100 },
  { name: "Sat", revenue: 2800, profit: 1700 },
  { name: "Sun", revenue: 2000, profit: 1100 },
];

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-4 border border-border rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        <p className="text-sm text-primary mb-1">
          Revenue: {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-sm text-teal-500">
          Profit: {formatCurrency(payload[1].value as number)}
        </p>
      </div>
    );
  }

  return null;
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const data = period === "monthly" ? monthlyData : weeklyData;

  return (
    <Card className="glass-effect">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Revenue Overview</CardTitle>
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as "weekly" | "monthly")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-1 pt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22D3EE"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
