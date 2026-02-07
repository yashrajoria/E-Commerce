import { useState } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const DashboardSidebar = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState(router.pathname);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Database, label: "Inventory", path: "/inventory" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "h-screen bg-card/30 backdrop-blur-lg border-r border-white/10 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between h-16">
        {!collapsed && (
          <div className="font-bold text-lg text-gradient">ShopSwift Admin</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hover:bg-white/5"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link
              href={item.path}
              onClick={() => setTab(item.path)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-white/10",
                tab === item.path
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon
                size={18}
                className={tab === item.path ? "text-primary" : ""}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/profile"
          onClick={() => setTab("/profile")}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            "hover:bg-white/10",
            tab === "/profile"
              ? "bg-primary/10 text-primary border-l-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              A
            </div>
            {!collapsed && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-background" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">
                admin@example.com
              </p>
            </div>
          )}
        </Link>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
