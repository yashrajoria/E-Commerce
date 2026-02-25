/**
 * Premium Page Layout – Shared wrapper for all admin pages.
 * Provides sidebar, top header bar, breadcrumbs, and page-level animations.
 */
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiveIndicator } from "@/components/dashboard/LiveIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Menu, X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";

// ── Page-level animation variants (same as dashboard) ──
export const pageContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const pageItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  title: string;
  metaDescription?: string;
  breadcrumbs?: Breadcrumb[];
  headerActions?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}

const PageLayout = ({
  title,
  metaDescription,
  breadcrumbs = [],
  headerActions,
  children,
  maxWidth = "max-w-[1600px]",
}: PageLayoutProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-background">
      <Head>
        <title>{title} — ShopSwift Admin</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
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
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="text-muted-foreground/40">/</span>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
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
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-white/[0.06] text-muted-foreground md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={16} />
              </Button>
              {headerActions}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-white/[0.06] text-muted-foreground"
                onClick={async () => {
                  try {
                    await axios.post(
                      "/api/auth/logout",
                      {},
                      { withCredentials: true },
                    );
                    toast.success("Signed out");
                    const router = useRouter();
                    router.replace("/sign-in");
                  } catch (e) {
                    console.error("Logout failed", e);
                    toast.error("Sign out failed");
                  }
                }}
              >
                Sign Out
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
            className={`p-4 sm:p-6 lg:p-8 space-y-6 ${maxWidth} mx-auto`}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
