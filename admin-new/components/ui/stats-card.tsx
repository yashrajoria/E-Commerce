/**
 * Premium Stats Card – Reusable stat/metric card matching dashboard KPI style
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
  gradient = "gradient-purple",
  glowClass = "glow-purple",
  subtitle,
  children,
}: StatsCardProps) => {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-effect rounded-xl p-5 card-hover relative overflow-hidden group"
    >
      {/* Background accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl group-hover:opacity-[0.12] transition-opacity",
          gradient,
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp size={12} className="text-emerald-400" />
              ) : (
                <TrendingDown size={12} className="text-rose-400" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  isPositive ? "text-emerald-400" : "text-rose-400",
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

        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            gradient,
            glowClass,
          )}
        >
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {children}
    </motion.div>
  );
};

export default StatsCard;
