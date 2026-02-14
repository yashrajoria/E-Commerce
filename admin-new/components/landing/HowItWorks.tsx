import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, Link2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with your email. No credit card required. Get instant access to all features with a 14-day free trial.",
    gradient: "gradient-purple",
    glowColor: "hsla(263, 70%, 58%, 0.15)",
  },
  {
    number: "02",
    icon: Link2,
    title: "Connect Your Store",
    description:
      "Integrate with Shopify, WooCommerce, or any platform in one click. We'll import your data automatically.",
    gradient: "gradient-emerald",
    glowColor: "hsla(160, 84%, 39%, 0.15)",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Managing",
    description:
      "Access your personalized dashboard instantly. Track orders, manage inventory, and watch your business grow.",
    gradient: "gradient-blue",
    glowColor: "hsla(217, 91%, 60%, 0.15)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
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
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect border border-blue-500/20 text-xs font-medium text-blue-300 mb-6">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Up and running in <span className="text-gradient">3 minutes</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Getting started is incredibly simple. No complex setup, no technical
            expertise required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-purple-500/30 via-emerald-500/30 to-blue-500/30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative text-center"
            >
              {/* Number Circle */}
              <div className="relative flex justify-center mb-8">
                <div
                  className="absolute inset-0 w-32 h-32 mx-auto rounded-full opacity-30 blur-2xl"
                  style={{ background: step.glowColor }}
                />
                <div className="relative">
                  <div
                    className={`h-16 w-16 rounded-2xl ${step.gradient} flex items-center justify-center shadow-xl mx-auto`}
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-lg glass-effect-strong border border-white/[0.1] flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
