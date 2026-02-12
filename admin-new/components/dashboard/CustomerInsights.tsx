/**
 * CustomerInsights – Premium donut chart with customer metrics
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

interface Segment {
  name: string;
  value: number;
  color: string;
  icon: React.ElementType;
}

const customerData: Segment[] = [
  { name: "Returning", value: 1580, color: "#8b5cf6", icon: UserCheck },
  { name: "New", value: 420, color: "#10b981", icon: UserPlus },
  { name: "Inactive", value: 210, color: "#64748b", icon: UserX },
  { name: "VIP", value: 107, color: "#f59e0b", icon: Users },
];

const total = customerData.reduce((sum, d) => sum + d.value, 0);

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="glass-effect-strong rounded-xl p-3 min-w-[120px] border border-white/10">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="text-xs font-medium text-foreground">{data.name}</span>
      </div>
      <p className="text-sm font-bold text-foreground mt-1">
        {(data.value as number).toLocaleString()} customers
      </p>
      <p className="text-[10px] text-muted-foreground">
        {(((data.value as number) / total) * 100).toFixed(1)}% of total
      </p>
    </div>
  );
};

export default function CustomerInsights() {
  return (
    <Card className="glass-effect border-gradient overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-rose flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-white" />
          </div>
          Customer Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="relative w-[160px] h-[160px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">
                {total.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {customerData.map((segment, idx) => (
              <motion.div
                key={segment.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.08 * idx }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {segment.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {segment.value.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    ({((segment.value / total) * 100).toFixed(0)}%)
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
