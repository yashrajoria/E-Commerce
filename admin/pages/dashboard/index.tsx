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
import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard metrics on mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("/api/admin/dashboard");
        const d = response.data?.data ?? response.data;
        if (d) {
          setDashboardData(d);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

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
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile menu + breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="font-semibold text-foreground">Dashboard</span>
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
                  placeholder="Search orders, products, customers..."
                  className="pl-9 h-9 bg-muted/40 border-border text-sm placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary/50 transition-all rounded-lg"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] border border-border rounded px-1.5 py-0.5 bg-background text-muted-foreground font-mono hidden lg:inline-block">
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
                      className="h-9 w-9 rounded-lg hover:bg-muted text-muted-foreground relative"
                    >
                      <Bell size={16} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Search toggle - mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-muted text-muted-foreground md:hidden"
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
                className="md:hidden border-t border-border px-4 py-2 overflow-hidden bg-card"
              >
                <Input
                  placeholder="Search..."
                  className="h-9 bg-muted/50 border-border text-sm rounded-lg"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex h-[60vh] items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !dashboardData ? (
            <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
              Failed to load dashboard data
            </div>
          ) : (
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
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {getGreeting()},{" "}
                    <span className="text-primary">{name}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar size={13} className="text-accent" />
                    {today} — Here&apos;s your store operational overview
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs border-border hover:bg-muted rounded-lg h-8 shadow-2xs font-medium"
                  >
                    <Download size={13} />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 font-medium shadow-2xs"
                  >
                    <Calendar size={13} />
                    This Month
                  </Button>
                </div>
              </motion.section>

              {/* ── KPI Stats ── */}
              <motion.section variants={pageItem}>
                <PremiumKPICards data={dashboardData.kpis} />
              </motion.section>

              {/* ── Charts Row ── */}
              <motion.section
                variants={pageItem}
                className="grid grid-cols-1 xl:grid-cols-5 gap-6"
              >
                <div className="xl:col-span-3">
                  <PremiumRevenueChart data={dashboardData.revenueCharts} />
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
                <TopProducts products={dashboardData.topProducts} />
                <div className="space-y-6">
                  <QuickActions />
                  <CustomerInsights insights={dashboardData.customerInsights} />
                </div>
                <RevenueForecast />
              </motion.section>

              {/* ── Recent Activity (Full Width) ── */}
              <motion.section variants={pageItem}>
                <RecentActivity activities={dashboardData.recentActivity} />
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx: import("next").GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
