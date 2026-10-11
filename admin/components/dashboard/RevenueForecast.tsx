/**
 * RevenueForecast – Operational revenue targets and pacing widget
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
    color: "#1f513f",
    trend: 12.5,
  },
  {
    label: "Quarterly Goal",
    current: 128500,
    target: 150000,
    icon: Calendar,
    color: "#059669",
    trend: 8.3,
  },
  {
    label: "Conversion Rate",
    current: 3.8,
    target: 5.0,
    icon: Zap,
    color: "#d97706",
    trend: 2.1,
  },
];

function RadialProgress({
  value,
  max,
  color,
  size = 52,
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
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="stroke-muted"
          strokeWidth={4}
        />
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
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-foreground">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default function RevenueForecast() {
  return (
    <Card className="bg-card border border-border shadow-2xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Target className="h-4 w-4" />
          </div>
          Target Pacing & Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 * idx }}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 transition-colors"
            >
              <RadialProgress
                value={metric.current}
                max={metric.target}
                color={metric.color}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">
                    {metric.label}
                  </span>
                  <TrendIndicator value={metric.trend} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    {metric.label === "Conversion Rate"
                      ? `${metric.current}%`
                      : `£${metric.current.toLocaleString()}`}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    /{" "}
                    {metric.label === "Conversion Rate"
                      ? `${metric.target}%`
                      : `£${metric.target.toLocaleString()}`}
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
