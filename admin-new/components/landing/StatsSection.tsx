import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, Globe, Zap, BarChart3 } from "lucide-react";

const stats = [
  {
    icon: ShoppingBag,
    value: 12400,
    suffix: "+",
    label: "Active Stores",
    description: "Enterprise scale deployments",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    value: 840,
    prefix: "£",
    suffix: "M+",
    label: "Gross GMV",
    description: "Processed annually",
    color: "text-accent",
  },
  {
    icon: Zap,
    value: 99.98,
    suffix: "%",
    label: "SLA Uptime",
    description: "Zero-downtime architecture",
    color: "text-emerald-400",
  },
  {
    icon: Globe,
    value: 180,
    suffix: "+",
    label: "Regions",
    description: "Global distribution network",
    color: "text-amber-400",
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

    const duration = 2500;
    const steps = 80;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Number((value * eased).toFixed(value % 1 === 0 ? 0 : 2)));

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
      {value >= 1000 ? display.toLocaleString(undefined, { maximumFractionDigits: value % 1 === 0 ? 0 : 2 }) : display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Metric Icon */}
              <div className="mb-6 flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-all">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>

              {/* Counter */}
              <div className="text-5xl font-bold tracking-tighter mb-2">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>

              {/* Labels */}
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground/80 font-light">
                  {stat.description}
                </p>
              </div>
              
              {/* Corner accent */}
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/0 group-hover:border-white/10 transition-all rounded-tr-md" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
