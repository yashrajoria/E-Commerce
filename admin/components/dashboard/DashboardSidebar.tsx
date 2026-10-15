import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAdminSession } from "@/lib/useAdminSession";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getNavItems } from "./sidebar/navConfig";
import type { NavItem } from "./sidebar/types";
import { useSidebarBadges } from "./sidebar/useSidebarBadges";

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DashboardSidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const badgeCounts = useSidebarBadges();
  const { user, loading: userLoading } = useAdminSession();

  const displayName =
    user?.name?.trim() ||
    (user?.email ? user.email.split("@")[0] : undefined) ||
    undefined;

  const navItems: NavItem[] = useMemo(
    () => getNavItems(badgeCounts),
    [badgeCounts],
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
          "hidden lg:flex h-screen bg-card border-r border-border sticky top-0 flex-col transition-all duration-300 z-20",
          collapsed ? "w-[72px]" : "w-[260px]",
        )}
      >
        {/* ── Brand Header ── */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
                  <span className="text-sm font-black tracking-tight">S</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h1 className="text-sm font-bold tracking-tight text-foreground leading-none">
                      ShopSwift
                    </h1>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                    Admin Pro
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-xs">
              <span className="text-sm font-black">S</span>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground"
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
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-muted-foreground text-xs hover:bg-muted hover:text-foreground transition-all duration-200">
              <Search size={13} />
              <span>Search...</span>
              <kbd className="ml-auto text-[10px] border border-border rounded px-1.5 py-0.5 bg-background font-mono">
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
                    className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {sectionName}
                  </motion.p>
                )}

                {collapsed && sectionIdx > 0 && (
                  <div className="mx-3 my-2 border-t border-border/60" />
                )}

                <div className="space-y-0.5">
                  {items.map((item, idx) => {
                    const active = isActive(item.path);
                    const content = (
                      <Link
                        href={item.path}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                          active
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
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
                            "shrink-0 transition-colors duration-150",
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
                          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-accent/20 text-accent text-[10px] font-bold px-1.5">
                            {item.badge}
                          </span>
                        )}

                        {item.badge && collapsed && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
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
                          duration: 0.2,
                          delay: 0.02 * (sectionIdx * 3 + idx),
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
                                <span className="ml-2 text-accent">
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
        <div className="border-t border-border p-2 space-y-1 bg-card">
          {/* Help */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                  <HelpCircle size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12}>
                Help & Support
              </TooltipContent>
            </Tooltip>
          ) : (
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
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
                  className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
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
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              "hover:bg-muted/60",
              collapsed && "justify-center px-0",
            )}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs ring-1 ring-border">
                {userLoading ? "..." : getInitials(displayName)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userLoading ? "Loading..." : displayName || "Admin"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {userLoading ? "" : user?.email || "No email"}
                </p>
              </div>
            )}
            {!collapsed && (
              <LogOut
                size={14}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              />
            )}
          </Link>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
