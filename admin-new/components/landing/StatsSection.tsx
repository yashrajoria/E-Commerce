import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ShoppingBag, Clock, Star } from "lucide-react";

const stats = [
  {
    icon: ShoppingBag,
    value: 10000,
    suffix: "+",
    label: "Active Stores",
    description: "Trusted by businesses worldwide",
    gradient: "gradient-purple",
  },
  {
    icon: TrendingUp,
    value: 50,
    prefix: "$",
    suffix: "M+",
    label: "Revenue Processed",
    description: "In total transaction volume",
    gradient: "gradient-emerald",
  },
  {
    icon: Clock,
    value: 99.9,
    suffix: "%",
    label: "Uptime Guarantee",
    description: "Enterprise-grade reliability",
    gradient: "gradient-blue",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    description: "From 2,400+ reviews",
    gradient: "gradient-amber",
  },
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  isInView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;

      // Easing
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((value * eased).toFixed(value % 1 === 0 ? 0 : 1)));

      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span>
      {prefix}
      {value >= 1000 ? display.toLocaleString() : display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-effect rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-500"
            >
              {/* Icon */}
              <div
                className={`h-12 w-12 rounded-xl ${stat.gradient} flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-5.5 w-5.5 text-white" />
              </div>

              {/* Value */}
              <div className="text-4xl font-bold mb-1 tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>

              {/* Label */}
              <h3 className="text-sm font-semibold text-foreground/80 mb-1">
                {stat.label}
              </h3>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
