import { CategoryIcon } from "@ecommerce/shared";
import {
  Activity,
  Bot,
  CreditCard,
  Headphones,
  Layers,
  LayoutDashboard,
  Megaphone,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from "lucide-react";
import type { BadgeCounts, NavItem } from "./types";

export const getNavItems = (badgeCounts: BadgeCounts): NavItem[] => [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    section: "Main",
  },
  {
    icon: Activity,
    label: "Analytics",
    path: "/analytics",
    section: "Main",
  },
  {
    icon: Bot,
    label: "AI Insights",
    path: "/dashboard/ai-insights",
    section: "Main",
  },
  {
    icon: Package,
    label: "Products",
    path: "/products",
    badge: badgeCounts.products,
    section: "Commerce",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    path: "/orders",
    badge: badgeCounts.orders,
    section: "Commerce",
  },
  {
    icon: Users,
    label: "Customers",
    path: "/customers",
    badge: badgeCounts.customers,
    section: "Commerce",
  },
  {
    icon: CategoryIcon,
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
    badge: badgeCounts.inventory,
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
];

