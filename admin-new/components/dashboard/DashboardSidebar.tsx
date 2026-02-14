/**
 * PremiumSidebar – Ultra-premium glassmorphism sidebar with
 * animated navigation, notification badges, quick actions, and responsive collapse
 */
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Tag,
  LogOut,
  Crown,
  Search,
  HelpCircle,
  Layers,
  Megaphone,
  Star,
  RotateCcw,
  Truck,
  Activity,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  section?: string;
}

const DashboardSidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        section: "Main",
      },
      {
        icon: BarChart3,
        label: "Analytics",
        path: "/analytics",
        section: "Main",
      },
      {
        icon: Package,
        label: "Products",
        path: "/products",
        badge: 12,
        section: "Commerce",
      },
      {
        icon: ShoppingCart,
        label: "Orders",
        path: "/orders",
        badge: 5,
        section: "Commerce",
      },
      {
        icon: Users,
        label: "Customers",
        path: "/customers",
        section: "Commerce",
      },
      {
        icon: Tag,
        label: "Categories",
        path: "/categories",
        section: "Commerce",
      },
      {
        icon: Megaphone,
        label: "Marketing",
        path: "/marketing",
        section: "Commerce",
      },
      {
        icon: Star,
        label: "Reviews",
        path: "/reviews",
        section: "Commerce",
      },
      {
        icon: Layers,
        label: "Inventory",
        path: "/inventory",
        section: "Finance",
      },
      {
        icon: Truck,
        label: "Shipping",
        path: "/shipping",
        section: "Finance",
      },
      {
        icon: RotateCcw,
        label: "Returns",
        path: "/returns",
        section: "Finance",
      },
      {
        icon: CreditCard,
        label: "Payments",
        path: "/payments",
        section: "Finance",
      },
      {
        icon: Headphones,
        label: "Support",
        path: "/support",
        section: "System",
      },
      {
        icon: Activity,
        label: "Activity Logs",
        path: "/activity-logs",
        section: "System",
      },
      {
        icon: Settings,
        label: "Settings",
        path: "/settings",
        section: "System",
      },
    ],
    [],
  );

  // Group items by section
  const sections = useMemo(() => {
    const map = new Map<string, NavItem[]>();
    navItems.forEach((item) => {
      const section = item.section || "General";
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(item);
    });
    return map;
  }, [navItems]);

  const isActive = (path: string) => router.pathname.startsWith(path);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "h-screen glass-sidebar sticky top-0 flex flex-col transition-all duration-300 z-20",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        {/* ── Brand Header ── */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.04]">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center glow-purple">
                  <Crown size={16} className="text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gradient leading-none">
                    ShopSwift
                  </h1>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                    Admin Pro
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center mx-auto glow-purple">
              <Crown size={16} className="text-white" />
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-white/[0.06] text-muted-foreground"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={14} />
            </Button>
          )}
        </div>

        {/* ── Quick Search ── */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-3 py-3"
          >
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-muted-foreground text-xs hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200">
              <Search size={13} />
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] border border-white/10 rounded px-1.5 py-0.5 bg-white/[0.03] font-mono">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
          {Array.from(sections.entries()).map(
            ([sectionName, items], sectionIdx) => (
              <div key={sectionName} className={cn(sectionIdx > 0 && "mt-4")}>
                {/* Section Label */}
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * sectionIdx }}
                    className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60"
                  >
                    {sectionName}
                  </motion.p>
                )}

                {collapsed && sectionIdx > 0 && (
                  <div className="mx-3 my-2 border-t border-white/[0.04]" />
                )}

                <div className="space-y-0.5">
                  {items.map((item, idx) => {
                    const active = isActive(item.path);
                    const content = (
                      <Link
                        href={item.path}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}

                        <item.icon
                          size={18}
                          className={cn(
                            "shrink-0 transition-colors duration-200",
                            active
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />

                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}

                        {/* Badge */}
                        {item.badge && !collapsed && (
                          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1.5">
                            {item.badge}
                          </span>
                        )}

                        {item.badge && collapsed && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </Link>
                    );

                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: 0.03 * (sectionIdx * 3 + idx),
                        }}
                      >
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{content}</TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={12}
                              className="font-medium"
                            >
                              {item.label}
                              {item.badge && (
                                <span className="ml-2 text-primary">
                                  ({item.badge})
                                </span>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          content
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </nav>

        {/* ── Bottom Section ── */}
        <div className="border-t border-white/[0.04] p-2 space-y-1">
          {/* Help */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all duration-200">
                  <HelpCircle size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                Help & Support
              </TooltipContent>
            </Tooltip>
          ) : (
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all duration-200">
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </button>
          )}

          {/* Expand button when collapsed */}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(false)}
                  className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all duration-200"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}

          {/* User Profile */}
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
              "hover:bg-white/[0.04]",
              collapsed && "justify-center px-0",
            )}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[hsl(var(--sidebar-background))]" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Admin User
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  admin@shopswift.com
                </p>
              </div>
            )}
            {!collapsed && (
              <LogOut
                size={14}
                className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"
              />
            )}
          </Link>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
