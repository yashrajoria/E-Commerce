import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingSectionProps {
  onGetStarted: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for small stores just getting started.",
    gradient: "",
    popular: false,
    features: [
      "Up to 100 products",
      "Basic analytics dashboard",
      "Order management",
      "Email support",
      "1 staff account",
      "Community access",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing businesses that need more power.",
    gradient: "gradient-purple",
    popular: true,
    features: [
      "Unlimited products",
      "Advanced analytics & reporting",
      "Multi-store support",
      "Priority support (24/7)",
      "10 staff accounts",
      "API access & webhooks",
      "Custom integrations",
      "Revenue forecasting",
    ],
    cta: "Start 14-Day Trial",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large-scale operations with custom needs.",
    gradient: "",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited staff accounts",
      "Dedicated account manager",
      "Custom SLA (99.99% uptime)",
      "SSO & advanced security",
      "White-label option",
      "On-premise deployment",
      "Custom feature development",
    ],
    cta: "Contact Sales",
  },
];

export default function PricingSection({ onGetStarted }: PricingSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect border border-purple-500/20 text-xs font-medium text-purple-300 mb-6">
            PRICING
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl p-[1px] ${
                plan.popular
                  ? "bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent"
                  : ""
              }`}
            >
              <div
                className={`relative glass-effect rounded-2xl p-8 h-full ${
                  plan.popular ? "ring-1 ring-purple-500/20" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-purple text-white border-0 shadow-lg shadow-purple-500/30 px-4 py-1 text-xs font-semibold">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-lg font-bold mt-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={onGetStarted}
                  className={`w-full rounded-xl h-11 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "gradient-purple text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
                      : "bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] text-foreground"
                  }`}
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          plan.popular ? "text-purple-400" : "text-emerald-400"
                        }`}
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
