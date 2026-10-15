/**
 * QuickActions – Operational quick-action grid for common store workflows
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Upload,
  Download,
  FileText,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  href: string;
  description: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Product",
    icon: Plus,
    href: "/products/add-product",
    description: "Create new listing",
  },
  {
    label: "Export Orders",
    icon: Download,
    href: "/orders",
    description: "Download CSV reports",
  },
  {
    label: "Inventory Sync",
    icon: Upload,
    href: "/inventory",
    description: "Stock reconciliations",
  },
  {
    label: "Store Reports",
    icon: FileText,
    href: "/analytics",
    description: "Detailed metrics",
  },
];

/**
 * Renders a grid of operational shortcut links for common store workflows.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <QuickActions />
 * ```
 */
export default function QuickActions() {
  return (
    <Card className="bg-card border border-border shadow-2xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
            <Zap className="h-4 w-4" />
          </div>
          Operational Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.03 * idx }}
              >
                <Link
                  href={action.href}
                  className="group block p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/80 hover:border-primary/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors mb-2">
                    <Icon size={14} />
                  </div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
