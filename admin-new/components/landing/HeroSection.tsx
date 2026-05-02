import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Shield,
  Zap,
  TrendingUp,
  ChevronDown,
  Lock,
  Globe,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const trustBadges = [
  { icon: Shield, label: "Enterprise Security" },
  { icon: Globe, label: "Global Infrastructure" },
  { icon: Database, label: "Real-time Syncing" },
];

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid with fade */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
          }} 
        />
        
        {/* Deep ambient glows */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsla(23, 83%, 58%, 0.08) 0%, transparent 70%)",
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, hsla(191, 73%, 56%, 0.06) 0%, transparent 70%)",
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* ── Announcement Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-effect border border-white/[0.08] text-sm font-medium text-foreground/80 hover:bg-white/[0.04] transition-all cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs uppercase tracking-[0.1em] font-semibold">Introducing V2.0</span>
            <div className="w-[1px] h-3 bg-white/10 mx-1" />
            <span>AI-Powered Inventory Prediction</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>

        {/* ── Main Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] max-w-5xl mx-auto">
            The <span className="text-gradient">Intelligence</span> Layer for Your <span className="text-foreground/90 italic serif font-medium">Business</span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            An industrial-grade e-commerce engine designed for high-growth brands. 
            Powerful metrics, predictive analytics, and effortless operations.
          </p>
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 px-10 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all text-base font-semibold group"
          >
            Deploy Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 rounded-2xl border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-foreground text-base font-medium transition-all"
            onClick={() =>
              document
                .querySelector("#preview")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Play className="mr-2 h-4 w-4 fill-current text-primary" />
            Live Preview
          </Button>
        </motion.div>

        {/* ── Trust & Security ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-10 border-t border-white/[0.04] flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors group cursor-default"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.06] transition-colors">
                <badge.icon className="h-4 w-4 text-primary/60" />
              </div>
              <span className="font-medium tracking-wide">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Floating Dashboard Preview (The "Wow" Element) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.8, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="mt-24 relative max-w-5xl mx-auto group"
        >
          {/* Multi-layered shadows and glows */}
          <motion.div 
            className="absolute -inset-20 bg-primary/20 rounded-[4rem] blur-[100px] z-0"
            animate={{ 
              opacity: [0.1, 0.25, 0.1],
              scale: [0.8, 1.1, 0.8]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute -inset-10 bg-primary/10 rounded-[3rem] blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-3xl blur-md opacity-50 z-0" />
          
          <div className="relative glass-effect-strong rounded-3xl border border-white/[0.1] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-10">
            {/* Browser-style Title Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="px-4 py-1 rounded-full bg-white/[0.04] text-[10px] font-mono text-muted-foreground/60 tracking-wider">
                CHANNELS • GLOBAL • SECURE
              </div>
              <div className="w-12" />
            </div>

            {/* Mock Dashboard Content with high visual fidelity */}
            <div className="p-8 space-y-8 bg-gradient-to-br from-transparent to-primary/[0.02]">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Net Revenue", value: "£42.8k", trend: "+12%", color: "text-primary" },
                  { label: "Conversion", value: "3.24%", trend: "+0.8%", color: "text-accent" },
                  { label: "Avg. Ticket", value: "£154", trend: "-2%", color: "text-muted-foreground" },
                  { label: "Active Subs", value: "1,284", trend: "+24%", color: "text-emerald-400" },
                ].map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col items-start"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">{kpi.label}</span>
                    <span className="text-2xl font-bold mb-1">{kpi.value}</span>
                    <span className={`text-[10px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {kpi.trend} vs LY
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Main Visual Component: Abstract Chart */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 h-64 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold tracking-tight uppercase">Performance Stream</span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(j => <div key={j} className="w-1 h-3 rounded-full bg-white/10" />)}
                    </div>
                  </div>
                  
                  {/* CSS Chart bars */}
                  <div className="flex items-end gap-2 h-32">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t-sm bg-primary/20"
                        initial={{ height: 0 }}
                        animate={{ 
                          height: `${30 + Math.sin(i * 0.4) * 40 + Math.random() * 30}%`,
                          backgroundColor: i > 20 ? 'rgba(var(--primary), 0.4)' : 'rgba(var(--primary), 0.1)'
                        }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 1.5 + (i * 0.03),
                          ease: "circOut" 
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Side Utility Panel */}
                <div className="rounded-2xl border border-dashed border-white/10 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">Access Control</p>
                        <p className="text-[10px] text-muted-foreground">Admin-only layer active</p>
                      </div>
                    </div>
                    <div className="h-[1px] bg-white/5 w-full" />
                    <div className="space-y-2">
                      {[1,2,3].map(s => (
                        <div key={s} className="flex items-center justify-between">
                          <div className="w-1/2 h-2 rounded-full bg-white/5" />
                          <div className="w-1/4 h-2 rounded-full bg-primary/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase tracking-widest font-bold opacity-50">
                    Configuration required
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-10 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
