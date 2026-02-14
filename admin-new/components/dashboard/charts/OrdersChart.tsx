import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Types
interface OrderData {
  name: string;
  orders: number;
  color: string;
}

// Sample data - replace with API data in production
const weeklyData: OrderData[] = [
  { name: "Mon", orders: 32, color: "#06B6D4" },
  { name: "Tue", orders: 45, color: "#06B6D4" },
  { name: "Wed", orders: 38, color: "#06B6D4" },
  { name: "Thu", orders: 42, color: "#06B6D4" },
  { name: "Fri", orders: 53, color: "#06B6D4" },
  { name: "Sat", orders: 41, color: "#06B6D4" },
  { name: "Sun", orders: 29, color: "#06B6D4" },
];

const lastWeekData: OrderData[] = [
  { name: "Mon", orders: 28, color: "#06B6D4" },
  { name: "Tue", orders: 38, color: "#06B6D4" },
  { name: "Wed", orders: 42, color: "#06B6D4" },
  { name: "Thu", orders: 35, color: "#06B6D4" },
  { name: "Fri", orders: 46, color: "#06B6D4" },
  { name: "Sat", orders: 40, color: "#06B6D4" },
  { name: "Sun", orders: 32, color: "#06B6D4" },
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
        <p className="text-sm text-teal-400">
          Orders: {payload[0].value as number}
        </p>
      </div>
    );
  }

  return null;
};

export default function OrdersChart() {
  const [period, setPeriod] = useState<"thisWeek" | "lastWeek">("thisWeek");
  const data = period === "thisWeek" ? weeklyData : lastWeekData;

  return (
    <Card className="glass-effect">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Orders</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={period === "thisWeek" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("thisWeek")}
              className={
                period === "thisWeek"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              This Week
            </Button>
            <Button
              variant={period === "lastWeek" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("lastWeek")}
              className={
                period === "lastWeek"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              Last Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1 pt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8} />
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="orders"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              fill="url(#barGradient)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
