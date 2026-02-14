import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Sparkline } from "@/components/ui/sparkline";
import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";

interface KPIStat {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  sparkColor: string;
  sparkData: number[];
}

const stats: KPIStat[] = [
  {
    title: "Total Revenue",
    value: 42835,
    prefix: "$",
    trend: 12.5,
    icon: Wallet,
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    glowColor: "shadow-violet-500/20",
    sparkColor: "#c4b5fd",
    sparkData: [28, 35, 32, 40, 38, 45, 52, 48, 55, 60, 58, 65],
  },
  {
    title: "Total Orders",
    value: 1462,
    trend: 5.2,
    icon: ShoppingCart,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    glowColor: "shadow-emerald-500/20",
    sparkColor: "#6ee7b7",
    sparkData: [40, 42, 38, 50, 45, 55, 48, 52, 60, 58, 62, 68],
  },
  {
    title: "Total Products",
    value: 346,
    trend: 3.1,
    icon: Package,
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glowColor: "shadow-amber-500/20",
    sparkColor: "#fcd34d",
    sparkData: [20, 25, 22, 28, 30, 32, 35, 33, 38, 36, 40, 42],
  },
  {
    title: "Active Users",
    value: 2317,
    trend: 8.4,
    icon: Users,
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    glowColor: "shadow-blue-500/20",
    sparkColor: "#93c5fd",
    sparkData: [50, 55, 60, 58, 65, 70, 68, 75, 72, 80, 78, 85],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export default function PremiumKPICards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat, idx) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <Card
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} ${stat.glowColor} shadow-xl card-hover group`}
          >
            <CardContent className="p-5">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                  <stat.icon className="h-[18px] w-[18px] text-white" />
                </div>
              </div>

              {/* Value */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1500}
                    />
                  </div>
                  <div className="mt-1.5">
                    <TrendIndicator
                      value={stat.trend}
                      className="!text-white/90"
                    />
                  </div>
                </div>

                {/* Sparkline - positioned at bottom right */}
                <div className="opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                  <Sparkline
                    data={stat.sparkData}
                    color={stat.sparkColor}
                    width={90}
                    height={36}
                    id={`kpi-spark-${idx}`}
                  />
                </div>
              </div>
            </CardContent>

            {/* Decorative floating circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.06] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/[0.04] pointer-events-none" />
            <div className="absolute top-1/2 right-4 w-1 h-8 rounded-full bg-white/10 pointer-events-none" />
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
