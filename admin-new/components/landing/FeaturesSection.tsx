import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Store,
  FileText,
  UsersRound,
  Code,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Monitor sales, traffic, and performance with live dashboards that update instantly.",
    gradient: "gradient-purple",
    glow: "purple",
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description:
      "Track, fulfill, and manage orders from a unified control center with smart automation.",
    gradient: "gradient-blue",
    glow: "blue",
  },
  {
    icon: Package,
    title: "Inventory Tracking",
    description:
      "Real-time stock levels, low-stock alerts, and automated reordering built right in.",
    gradient: "gradient-emerald",
    glow: "emerald",
  },
  {
    icon: Users,
    title: "Customer Insights",
    description:
      "Deep customer analytics, segmentation, and behavior tracking for smarter decisions.",
    gradient: "gradient-amber",
    glow: "amber",
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description:
      "Accept payments globally with integrated Stripe, PayPal, and 50+ payment gateways.",
    gradient: "gradient-rose",
    glow: "rose",
  },
  {
    icon: Store,
    title: "Multi-Store Support",
    description:
      "Manage multiple storefronts from a single dashboard with unified reporting.",
    gradient: "gradient-teal",
    glow: "teal",
  },
  {
    icon: FileText,
    title: "Advanced Reporting",
    description:
      "Custom report builder with export capabilities, scheduled reports, and data visualization.",
    gradient: "gradient-purple",
    glow: "purple",
  },
  {
    icon: UsersRound,
    title: "Team Collaboration",
    description:
      "Role-based access control, activity logs, and team workflows for seamless collaboration.",
    gradient: "gradient-blue",
    glow: "blue",
  },
  {
    icon: Code,
    title: "API Integration",
    description:
      "RESTful API with webhooks, SDKs, and pre-built integrations for your tech stack.",
    gradient: "gradient-emerald",
    glow: "emerald",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Fully responsive admin panel — manage your store from anywhere, on any device.",
    gradient: "gradient-amber",
    glow: "amber",
  },
];

const glowColors: Record<string, string> = {
  purple: "group-hover:shadow-purple-500/10",
  blue: "group-hover:shadow-blue-500/10",
  emerald: "group-hover:shadow-emerald-500/10",
  amber: "group-hover:shadow-amber-500/10",
  rose: "group-hover:shadow-rose-500/10",
  teal: "group-hover:shadow-teal-500/10",
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect border border-purple-500/20 text-xs font-medium text-purple-300 mb-6">
            FEATURES
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="text-gradient">scale your store</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            A comprehensive suite of tools designed to help you manage, grow,
            and optimize every aspect of your e-commerce business.
          </p>
        </motion.div>

        {/* Feature Cards — Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((feature, i) => {
            // Make first 2 items span 2 cols on xl
            const isLarge = i < 2;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative glass-effect rounded-2xl p-6 cursor-default transition-all duration-500 hover:-translate-y-1 ${
                  glowColors[feature.glow] || ""
                } hover:shadow-2xl ${
                  isLarge ? "xl:col-span-2 sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-white/[0.08]" />

                {/* Icon */}
                <div
                  className={`h-11 w-11 rounded-xl ${feature.gradient} flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-5 w-5 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold mb-2 text-foreground group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
