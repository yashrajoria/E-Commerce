import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div
        ref={ref}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background Gradients */}
          <div className="absolute inset-0 gradient-purple opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-600/20 to-emerald-500/10" />

          {/* Glow effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 dot-grid opacity-20" />

          {/* Content */}
          <div className="relative px-8 py-20 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              14-day free trial — No credit card required
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to transform your
              <br />
              e-commerce operations?
            </h2>

            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              Join 10,000+ businesses already using our platform to streamline
              operations, boost revenue, and deliver exceptional customer
              experiences.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-white text-purple-700 hover:bg-white/90 rounded-xl shadow-xl shadow-black/20 hover:scale-[1.03] transition-all duration-300 text-base font-semibold px-8 h-13"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl h-13 px-6 text-base"
                onClick={() =>
                  document
                    .querySelector("#pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Pricing
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
