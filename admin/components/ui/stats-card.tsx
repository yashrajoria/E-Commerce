/**
 * StatsCard – Operational metric card matching ShopSwift design system
 */
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label?: string };
  gradient?: string;
  glowClass?: string;
  subtitle?: string;
  children?: ReactNode;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  children,
}: StatsCardProps) => {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className="bg-card border border-border rounded-xl p-4 shadow-2xs group relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {isPositive ? (
                <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown size={13} className="text-rose-600 dark:text-rose-400" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                )}
              >
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-muted-foreground">
                  {trend.label}
                </span>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
          <Icon size={16} />
        </div>
      </div>

      {children}
    </motion.div>
  );
};

export default StatsCard;
