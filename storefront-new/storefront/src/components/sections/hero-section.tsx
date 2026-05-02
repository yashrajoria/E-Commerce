"use client";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/* ── Typewriter hook ─────────────────────────── */
const typewriterPhrases = [
  "Signature Style",
  "Perfect Wardrobe",
  "Luxury Finds",
  "Bold Statement",
];

function useTypewriter(
  phrases: string[],
  typingMs = 90,
  pauseMs = 2200,
  deletingMs = 45,
) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIdx];
    if (!isDeleting) {
      setText(currentPhrase.slice(0, text.length + 1));
      if (text.length + 1 === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), pauseMs);
        return pauseMs + deletingMs;
      }
      return typingMs + Math.random() * 40;
    } else {
      setText(currentPhrase.slice(0, text.length - 1));
      if (text.length - 1 === 0) {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
        return typingMs;
      }
      return deletingMs;
    }
  }, [text, phraseIdx, isDeleting, phrases, typingMs, pauseMs, deletingMs]);

  useEffect(() => {
    const delay = tick();
    const timer = setTimeout(() => {
      tick();
      // re-render triggers the effect again
    }, delay);
    return () => clearTimeout(timer);
  }, [tick]);

  return text;
}

/* ── Floating particle ───────────────────────── */
function FloatingParticle({
  delay,
  size,
  x,
  y,
}: {
  delay: number;
  size: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-rose-400/25 to-amber-400/20 dark:from-rose-500/15 dark:to-amber-500/10"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, -10, 0],
        scale: [1, 1.2, 0.9, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSection() {
  const { data } = useProducts(3, 1, true);
  const products = data?.products ?? [];
  // const spotlightProduct = products[0];
  const formatGBP = (value?: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value ?? 0);

  // Fallback products for initial wow factor if API is empty or images are broken
  const fallbackProducts = [
    {
      id: "fallback-1",
      name: "Heritage Chronograph",
      price: 1250,
      images: ["/products/watch.png"],
    },
    {
      id: "fallback-2",
      name: "Acoustic Pro Max",
      price: 349,
      images: ["/products/headphones.png"],
    },
    {
      id: "fallback-3",
      name: "Cloud Walker Sneakers",
      price: 180,
      images: ["/products/sneakers.png"],
    },
  ];

  const displayProducts =
    products && products.length > 0 ? products : fallbackProducts;
  const spotlightProduct = displayProducts[0];

  const heroStats = [
    { value: "12k+", label: "Curated products" },
    { value: "48h", label: "Fast dispatch" },
    { value: "4.9/5", label: "Customer rating" },
  ];

  const typed = useTypewriter(typewriterPhrases);

  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center">
      {/* Warm sunset gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/70 via-background to-amber-50/50 dark:from-rose-950/30 dark:via-background dark:to-amber-950/20" />

        {/* Aurora overlay */}
        <div className="absolute inset-0 aurora-bg" />

        {/* Ambient glow orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-400/15 dark:bg-rose-500/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-64 h-64 bg-orange-300/10 dark:bg-orange-500/5 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
        />

        {/* Floating particles */}
        <FloatingParticle delay={0} size={6} x="15%" y="20%" />
        <FloatingParticle delay={1.2} size={4} x="70%" y="15%" />
        <FloatingParticle delay={2.5} size={8} x="85%" y="60%" />
        <FloatingParticle delay={0.8} size={5} x="40%" y="75%" />
        <FloatingParticle delay={3} size={3} x="60%" y="40%" />
        <FloatingParticle delay={1.5} size={7} x="25%" y="55%" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Announcement pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium border border-rose-200/60 dark:border-rose-800/40">
                <Sparkles className="w-3.5 h-3.5" />
                New Season Collection — Up to 60% Off
              </span>
            </motion.div>

            {/* Headline with typewriter effect */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Discover Your
                <span className="block mt-1 min-h-[1.15em]">
                  <span className="text-gradient-premium">{typed}</span>
                  <span className="typewriter-cursor h-[0.85em] align-middle" />
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Curated collections from world-class brands. Premium quality,
                exceptional craftsmanship, delivered to your doorstep.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="h-13 px-8 text-white cursor-pointer bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 rounded-full text-[15px] font-medium"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 rounded-full text-[15px] font-medium border-2 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>

            {/* Fast trust stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-border/50 bg-card/70 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.08 }}
                >
                  <p className="text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over £50" },
                {
                  icon: Shield,
                  label: "Secure Payment",
                  sub: "100% protected",
                },
                { icon: Sparkles, label: "Premium Quality", sub: "Guaranteed" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="h-10 w-10 rounded-xl bg-rose-100/60 dark:bg-rose-900/20 flex items-center justify-center">
                    <item.icon className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Floating Product Showcase */}
          <motion.div
            className="relative h-[540px] lg:h-[600px] hidden md:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Background decoration — warm sunset glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-br from-rose-300/20 to-amber-300/20 dark:from-rose-600/10 dark:to-amber-600/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Floating product cards */}
            {displayProducts.length > 0 &&
              displayProducts.slice(0, 3).map((product, index) => {
                const positions = [
                  { top: "2%", left: "5%", width: "220px" },
                  { top: "30%", right: "8%", width: "200px" },
                  { bottom: "12%", left: "15%", width: "210px" },
                ];
                const pos = positions[index] || positions[0];

                return (
                  <Link
                    key={product.id || index}
                    href={`/products/${product.id}`}
                    className="absolute z-20 group"
                    style={{ ...pos }}
                  >
                    <motion.div
                      className="glass rounded-2xl p-4 shadow-xl shadow-black/5 dark:shadow-black/20 premium-card gradient-border overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{
                        opacity: 1,
                        y: [0, -12, 0],
                        rotate: [0, index % 2 === 0 ? 1 : -1, 0],
                      }}
                      transition={{
                        delay: 0.4 + index * 0.15,
                        duration: 0.6,
                        y: {
                          duration: 5 + index * 1.2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                        rotate: {
                          duration: 7 + index * 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                        <Image
                          src={product.images?.[0] || "/icons8-image-100.png"}
                          alt={product.name}
                          fill
                          sizes="220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-rose-600 dark:text-rose-400 font-semibold text-sm">
                          {formatGBP(product.price)}
                        </p>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-rose-600 dark:text-rose-400" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}

            {spotlightProduct && (
              <motion.div
                className="absolute bottom-8 right-8 glass rounded-3xl p-5 shadow-xl shadow-black/10 dark:shadow-black/30 premium-card max-w-[280px]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl shrink-0 bg-muted">
                    <Image
                      src={
                        spotlightProduct.images?.[0] || "/icons8-image-100.png"
                      }
                      alt={spotlightProduct.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
                      Spotlight pick
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-sm leading-snug">
                      {spotlightProduct.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatGBP(spotlightProduct.price)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/products/${spotlightProduct.id}`}
                  className="mt-4 inline-flex text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline"
                >
                  View details
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
