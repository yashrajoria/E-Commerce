import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import PremiumKPICards from "@/components/dashboard/PremiumKPICards";
import PremiumRevenueChart from "@/components/dashboard/charts/PremiumRevenueChart";
import PremiumOrdersChart from "@/components/dashboard/charts/PremiumOrdersChart";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CustomerInsights from "@/components/dashboard/CustomerInsights";
import RevenueForecast from "@/components/dashboard/RevenueForecast";
import QuickActions from "@/components/dashboard/QuickActions";
import { LiveIndicator } from "@/components/dashboard/LiveIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Calendar, Download, Menu, X } from "lucide-react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useCallback } from "react";

// ── Page-level animation variants ──
const pageContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const pageItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const Dashboard = ({ name }: { name: string }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Head>
        <title>Dashboard — ShopSwift Admin</title>
        <meta name="description" content="Premium E-Commerce Admin Dashboard" />
      </Head>

      {/* ── Sidebar ── */}
      <DashboardSidebar />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top Header Bar ── */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/[0.04] glass-effect-strong">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile menu + breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="font-medium text-foreground">Dashboard</span>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search anything..."
                  className="pl-9 h-9 bg-white/[0.03] border-white/[0.06] text-sm placeholder:text-muted-foreground/50 focus:bg-white/[0.06] focus:border-primary/30 transition-all rounded-xl"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] border border-white/10 rounded px-1.5 py-0.5 bg-white/[0.03] text-muted-foreground font-mono hidden lg:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <LiveIndicator />

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-white/[0.06] text-muted-foreground relative"
                    >
                      <Bell size={16} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Search toggle - mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-white/[0.06] text-muted-foreground md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={16} />
              </Button>
            </div>
          </div>

          {/* Mobile search overlay */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-white/[0.04] px-4 py-2 overflow-hidden"
              >
                <Input
                  placeholder="Search..."
                  className="h-9 bg-white/[0.03] border-white/[0.06] text-sm rounded-xl"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <motion.div
            variants={pageContainer}
            initial="hidden"
            animate="show"
            className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto"
          >
            {/* ── Welcome Section ── */}
            <motion.section
              variants={pageItem}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {getGreeting()}, <span className="text-gradient">{name}</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Calendar size={13} />
                  {today} — Here&apos;s your store overview
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8"
                >
                  <Download size={13} />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
                >
                  <Calendar size={13} />
                  This Month
                </Button>
              </div>
            </motion.section>

            {/* ── KPI Stats ── */}
            <motion.section variants={pageItem}>
              <PremiumKPICards />
            </motion.section>

            {/* ── Charts Row ── */}
            <motion.section
              variants={pageItem}
              className="grid grid-cols-1 xl:grid-cols-5 gap-6"
            >
              <div className="xl:col-span-3">
                <PremiumRevenueChart />
              </div>
              <div className="xl:col-span-2">
                <PremiumOrdersChart />
              </div>
            </motion.section>

            {/* ── Middle Row: Top Products + Quick Actions + Customer Insights ── */}
            <motion.section
              variants={pageItem}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <TopProducts />
              <div className="space-y-6">
                <QuickActions />
                <CustomerInsights />
              </div>
              <RevenueForecast />
            </motion.section>

            {/* ── Recent Activity (Full Width) ── */}
            <motion.section variants={pageItem}>
              <RecentActivity />
            </motion.section>

            {/* ── Footer ── */}
            <motion.footer
              variants={pageItem}
              className="text-center py-4 text-xs text-muted-foreground/40"
            >
              © {new Date().getFullYear()} ShopSwift Admin Pro — Premium
              E-Commerce Dashboard
            </motion.footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      name: "Admin",
    },
  };
};
