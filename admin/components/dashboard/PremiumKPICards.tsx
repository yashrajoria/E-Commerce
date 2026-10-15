import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface KPIStat {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: LucideIcon;
  trendLabel?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function formatKPIValue(val: number, prefix = "", suffix = ""): string {
  // If revenue (prefix £), format as currency
  if (prefix === "£") {
    const formatted =
      val > 9999
        ? (val / 100).toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : val.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
    return `£${formatted}`;
  }
  return `${prefix}${val.toLocaleString("en-GB")}${suffix}`;
}

/** Props accepted by {@link PremiumKPICards}. */
interface PremiumKPICardsProps {
  /**
   * KPI metrics keyed by metric name (`totalRevenue`, `totalOrders`,
   * `totalProducts`, `activeUsers`), each with its current value and trend.
   */
  data: Record<string, { value: number; trend: number } | undefined>;
}

/**
 * Renders the four premium KPI cards with staggered entrance animation and
 * per-metric trend footers.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <PremiumKPICards data={dashboardData.kpis} />
 * ```
 */
export default function PremiumKPICards({ data }: PremiumKPICardsProps) {
  if (!data) return null;

  const stats: KPIStat[] = [
    {
      title: "Total Revenue",
      value: data.totalRevenue?.value || 0,
      prefix: "£",
      trend: data.totalRevenue?.trend || 12.4,
      icon: Wallet,
      trendLabel: "+12.4% vs last month",
    },
    {
      title: "Total Orders",
      value: data.totalOrders?.value || 0,
      trend: data.totalOrders?.trend || 8.1,
      icon: ShoppingCart,
      trendLabel: "+8.1% vs last month",
    },
    {
      title: "Active Products",
      value: data.totalProducts?.value || 0,
      trend: data.totalProducts?.trend || 4.2,
      icon: Package,
      trendLabel: "+4.2% catalog growth",
    },
    {
      title: "Registered Customers",
      value: data.activeUsers?.value || 0,
      trend: data.activeUsers?.trend || 15.3,
      icon: Users,
      trendLabel: "+15.3% new customers",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all duration-200">
              <CardContent className="p-0">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Primary Metric Value */}
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                    {formatKPIValue(stat.value, stat.prefix, stat.suffix)}
                  </span>
                </div>

                {/* Trend Footer */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {stat.trend > 0 ? `+${stat.trend}%` : `${stat.trend}%`}
                  </span>
                  <span>vs last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
