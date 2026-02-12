import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Shield,
  Zap,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const trustBadges = [
  { icon: Shield, label: "Enterprise Security" },
  { icon: Zap, label: "99.9% Uptime" },
  { icon: TrendingUp, label: "10,000+ Stores" },
];

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient Mesh */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Radial Glow Orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsla(263,70%,58%,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsla(160,84%,39%,0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-20 h-20 border border-purple-500/20 rounded-xl"
        animate={{ rotate: 360, y: [0, -15, 0] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ filter: "blur(1px)" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-14 h-14 border border-emerald-500/15 rounded-full"
        animate={{ rotate: -360, y: [0, -20, 0] }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        style={{ filter: "blur(1px)" }}
      />
      <motion.div
        className="absolute top-[40%] left-[15%] w-3 h-3 bg-purple-500/30 rounded-full"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[20%] w-2 h-2 bg-emerald-500/30 rounded-full"
        animate={{ y: [0, -25, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border border-purple-500/20 text-sm text-purple-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            Now with AI-powered analytics
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] max-w-5xl mx-auto"
        >
          Manage Your <span className="text-shimmer">E-Commerce</span>
          <br />
          <span className="text-gradient">Empire</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Powerful analytics, seamless operations, and real-time insights — all
          in one beautiful dashboard. The admin panel that scales with you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="gradient-purple text-white border-0 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.03] transition-all duration-300 text-base font-semibold px-8 h-13 btn-glow-pulse"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-4.5 w-4.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-foreground h-13 px-8 text-base font-medium transition-all duration-300"
            onClick={() =>
              document
                .querySelector("#preview")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-muted-foreground/70"
            >
              <badge.icon className="h-4 w-4 text-purple-400/60" />
              {badge.label}
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          {/* Glow behind the card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-transparent to-emerald-500/10 rounded-3xl blur-2xl" />

          {/* Mock Dashboard */}
          <div className="relative glass-effect-strong rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/40">
            {/* Title Bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] text-xs text-muted-foreground">
                  admin.yourstore.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="p-6 space-y-4">
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Revenue",
                    value: "$48,250",
                    change: "+12.5%",
                    color: "purple",
                  },
                  {
                    label: "Orders",
                    value: "1,284",
                    change: "+8.3%",
                    color: "emerald",
                  },
                  {
                    label: "Customers",
                    value: "3,642",
                    change: "+15.2%",
                    color: "blue",
                  },
                  {
                    label: "Conversion",
                    value: "3.24%",
                    change: "+2.1%",
                    color: "amber",
                  },
                ].map((kpi) => (
                  <motion.div
                    key={kpi.label}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + Math.random() * 0.3,
                    }}
                  >
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-xl font-bold mt-1">{kpi.value}</p>
                    <p className="text-xs text-emerald-400 mt-1">
                      {kpi.change}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Chart Area Mock */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 h-40 flex items-end gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-purple-500/40 to-purple-500/10"
                    initial={{ height: 0 }}
                    animate={{
                      height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 50}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 1.8 + i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
