import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
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
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[3rem] overflow-hidden border border-white/[0.08] shadow-2xl"
        >
          {/* Deep industrial background */}
          <div className="absolute inset-0 bg-[#0a0a0b]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

          {/* Content */}
          <div className="relative px-8 py-24 md:px-20 md:py-28 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-bold tracking-[0.2em] text-primary mb-10 uppercase"
            >
              <Terminal className="h-3 w-3" />
              Instance deployment ready
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
              Take absolute control of your <span className="text-gradient">commerce stack.</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl mx-auto">
              Join the next generation of high-growth brands. Deploy our 
              industrial-grade admin panel and start scaling today.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="h-16 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all text-lg font-bold group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-16 px-10 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/[0.03] text-lg font-medium transition-all"
                onClick={() =>
                  document
                    .querySelector("#preview")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Schedule Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
