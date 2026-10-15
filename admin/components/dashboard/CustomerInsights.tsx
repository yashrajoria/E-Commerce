/**
 * CustomerInsights – Operational donut chart with customer cohort metrics
 */
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

/** Props accepted by {@link CustomerInsights}. */
interface CustomerInsightsProps {
  /** Cohort breakdown; each entry contributes a donut segment and legend row. */
  insights: Array<{
    /** Cohort name, e.g. `"New"`, `"Returning"`, `"VIP"` or `"Inactive"`. */
    name: string;
    /** Number of customers in the cohort. */
    value: number;
  }>;
}

/**
 * Renders the customer-cohort donut chart with legend and total customer count.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <CustomerInsights insights={dashboardData.customerInsights} />
 * ```
 */
export default function CustomerInsights({ insights }: CustomerInsightsProps) {
  if (!insights || insights.length === 0) return null;

  // Map the backend insight data to ShopSwift palette
  const mappedData: Segment[] = insights.map((insight) => {
    let color = "#1f513f"; // Primary Forest Cypress
    let icon = Users;

    if (insight.name === "Returning") {
      color = "#1f513f";
      icon = UserCheck;
    } else if (insight.name === "New") {
      color = "#d97706"; // Amber
      icon = UserPlus;
    } else if (insight.name === "VIP") {
      color = "#059669"; // Emerald
      icon = Users;
    } else if (insight.name === "Inactive") {
      color = "#94a3b8"; // Slate
      icon = UserX;
    }

    return {
      name: insight.name,
      value: insight.value,
      color,
      icon,
    };
  });

  const total = mappedData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="bg-card border border-border shadow-2xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          Customer Cohorts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="relative w-[140px] h-[140px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mappedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {mappedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({
                    active,
                    payload,
                  }: TooltipProps<number, string>) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0];
                    return (
                      <div className="bg-popover text-popover-foreground rounded-lg p-2.5 min-w-[120px] border border-border shadow-md">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: (data.payload as Segment).color,
                            }}
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {data.name}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground mt-1">
                          {(data.value as number).toLocaleString()} users
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {total > 0
                            ? (((data.value as number) / total) * 100).toFixed(
                                1,
                              )
                            : 0}
                          % of total
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold tracking-tight text-foreground">
                {total.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {mappedData.map((segment) => {
              const Icon = segment.icon;
              const percentage =
                total > 0 ? ((segment.value / total) * 100).toFixed(0) : "0";
              return (
                <div
                  key={segment.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: segment.color }}
                    />
                    <Icon
                      size={12}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="font-medium text-foreground truncate">
                      {segment.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {segment.value}
                    </span>
                    <span className="text-[11px]">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
