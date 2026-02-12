import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const integrations = [
  "Stripe",
  "PayPal",
  "Shopify",
  "WooCommerce",
  "Square",
  "Razorpay",
  "Mailchimp",
  "Slack",
  "Zapier",
  "Google Analytics",
  "Meta Ads",
  "QuickBooks",
];

export default function IntegrationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Integrations
          </p>
          <h3 className="text-2xl font-bold">Works with your favorite tools</h3>
        </motion.div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex animate-marquee">
            {[...integrations, ...integrations].map((name, i) => (
              <motion.div
                key={`${name}-${i}`}
                className="flex-shrink-0 mx-4 px-8 py-4 glass-effect rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-all duration-300 group cursor-default"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
