import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "CEO, Fashion Forward",
    avatar: "SJ",
    rating: 5,
    quote:
      "This admin panel completely transformed how we manage our online store. Revenue tracking is incredibly intuitive and the real-time analytics have been a game-changer for our team.",
  },
  {
    name: "Michael Chen",
    title: "CTO, TechGear Pro",
    avatar: "MC",
    rating: 5,
    quote:
      "We migrated from three different tools to this single dashboard. The API integration is flawless, and our team productivity increased by 40% in the first month.",
  },
  {
    name: "Emily Rodriguez",
    title: "Operations Director, HomeStyle",
    avatar: "ER",
    rating: 5,
    quote:
      "The inventory management alone saved us thousands in overstock costs. The automated alerts and reordering features are simply brilliant. Best investment we made.",
  },
  {
    name: "David Kim",
    title: "Founder, Artisan Market",
    avatar: "DK",
    rating: 5,
    quote:
      "As someone who runs multiple storefronts, the multi-store support is invaluable. I can see everything in one place and the reporting tools are incredibly detailed.",
  },
  {
    name: "Lisa Wang",
    title: "Marketing Lead, GreenLeaf",
    avatar: "LW",
    rating: 5,
    quote:
      "The customer insights feature helped us understand our audience so much better. Our conversion rate jumped from 2.1% to 4.8% after implementing data-driven changes based on the analytics.",
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div
        ref={ref}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect border border-amber-500/20 text-xs font-medium text-amber-300 mb-6">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Loved by <span className="text-gradient">businesses</span> worldwide
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Join thousands of store owners who have transformed their operations
            with our platform.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-effect-strong rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 h-16 w-16 text-purple-500/10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-amber-400 fill-amber-400"
                      />
                    ),
                  )}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 max-w-3xl mx-auto">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                    <AvatarFallback className="bg-purple-500/20 text-purple-300 text-sm font-bold">
                      {testimonials[current].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-sm">
                      {testimonials[current].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonials[current].title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="h-9 w-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Dots */}
              <div className="flex gap-1.5 mx-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-purple-500"
                        : "w-1.5 bg-white/[0.15] hover:bg-white/[0.25]"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="h-9 w-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
