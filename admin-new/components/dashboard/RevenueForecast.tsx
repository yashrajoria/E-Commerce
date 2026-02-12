/**
 * RevenueForecast – Premium revenue forecast comparison widget
 * Shows target vs actual with radial progress and trend data
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Target, Calendar, Zap } from "lucide-react";

interface ForecastMetric {
  label: string;
  current: number;
  target: number;
  icon: React.ElementType;
  color: string;
  trend: number;
}

const metrics: ForecastMetric[] = [
  {
    label: "Monthly Revenue",
    current: 42835,
    target: 50000,
    icon: Target,
    color: "#8b5cf6",
    trend: 12.5,
  },
  {
    label: "Quarterly Goal",
    current: 128500,
    target: 150000,
    icon: Calendar,
    color: "#10b981",
    trend: 8.3,
  },
  {
    label: "Conversion Rate",
    current: 3.8,
    target: 5.0,
    icon: Zap,
    color: "#f59e0b",
    trend: 2.1,
  },
];

function RadialProgress({
  value,
  max,
  color,
  size = 56,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={4}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default function RevenueForecast() {
  return (
    <Card className="glass-effect border-gradient overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-amber flex items-center justify-center">
            <Target className="h-3.5 w-3.5 text-white" />
          </div>
          Goals & Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 * idx }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-200"
            >
              <RadialProgress
                value={metric.current}
                max={metric.target}
                color={metric.color}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {metric.label}
                  </span>
                  <TrendIndicator value={metric.trend} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-foreground">
                    {metric.label === "Conversion Rate"
                      ? `${metric.current}%`
                      : `$${metric.current.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    /{" "}
                    {metric.label === "Conversion Rate"
                      ? `${metric.target}%`
                      : `$${metric.target.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
