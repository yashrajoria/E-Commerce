import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  Database,
  Users,
  Code2,
  PieChart,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Predictive Analytics",
    description:
      "Advanced forecasting models that predict inventory needs and seasonal trends with high precision.",
    gradient: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    icon: Cpu,
    title: "Autonomous Logistics",
    description:
      "Automated order routing and smart fulfillment logic that optimizes for cost and delivery speed.",
    gradient: "bg-accent/10",
    textColor: "text-accent",
  },
  {
    icon: Layers,
    title: "Unified Inventory",
    description:
      "A single source of truth for all your warehouses and sales channels, synced in sub-seconds.",
    gradient: "bg-emerald-500/10",
    textColor: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Guard",
    description:
      "Bank-grade security protocols with granular role-based access control and detailed activity logs.",
    gradient: "bg-amber-500/10",
    textColor: "text-amber-400",
  },
  {
    icon: Globe,
    title: "Global Commerce",
    description:
      "Multi-currency, multi-language, and multi-tax support for brands scaling across borders.",
    gradient: "bg-rose-500/10",
    textColor: "text-rose-400",
  },
  {
    icon: Database,
    title: "Elastic Data Warehousing",
    description:
      "Scalable data storage that handles millions of SKUs and orders without performance degradation.",
    gradient: "bg-teal-500/10",
    textColor: "text-teal-400",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-24"
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full glass-effect border border-white/[0.08] text-[10px] font-bold tracking-[0.2em] text-primary mb-6 uppercase">
            Core Infrastructure
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            Designed for <span className="text-gradient">high-velocity</span> commerce.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground font-light leading-relaxed">
            The platform provides the industrial-grade tools you need to manage 
            every layer of your business with absolute precision and scale.
          </p>
        </motion.div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl glass-effect border border-white/[0.05] hover:bg-white/[0.03] transition-all duration-500"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {feature.description}
              </p>
              
              {/* Subtle hover decoration */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
