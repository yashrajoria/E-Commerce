/**
 * RecentActivity – Premium activity feed with type indicators,
 * time stamps, and smooth animated entries
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Clock,
  ShoppingCart,
  Wallet,
  Package,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  icon: LucideIcon;
  variant: "success" | "warning" | "error" | "info" | "neutral";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "New Order",
    description: "John Doe purchased Premium Wireless Headphones × 2",
    time: "2 min ago",
    icon: ShoppingCart,
    variant: "success",
  },
  {
    id: "2",
    type: "Payment Received",
    description: "Payment of $1,249.00 processed successfully",
    time: "15 min ago",
    icon: CheckCircle2,
    variant: "success",
  },
  {
    id: "3",
    type: "Refund Request",
    description: "Sarah Smith requested refund for Smart Watch Pro",
    time: "45 min ago",
    icon: Wallet,
    variant: "warning",
  },
  {
    id: "4",
    type: "Low Stock Alert",
    description: "Gaming Mouse Pro is running low (3 remaining)",
    time: "1 hour ago",
    icon: AlertTriangle,
    variant: "error",
  },
  {
    id: "5",
    type: "New Customer",
    description: "Michael Brown created an account",
    time: "2 hours ago",
    icon: Users,
    variant: "info",
  },
  {
    id: "6",
    type: "Product Updated",
    description: "Inventory updated for Organic Cotton T-Shirt",
    time: "3 hours ago",
    icon: Package,
    variant: "neutral",
  },
];

export default function RecentActivity() {
  return (
    <Card className="glass-effect border-gradient overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-blue flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-white" />
            </div>
            Recent Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary gap-1"
          >
            View All <ArrowRight size={12} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-1">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all duration-200"
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  <activity.icon
                    size={14}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <StatusBadge
                    variant={activity.variant}
                    label={activity.type}
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed truncate">
                  {activity.description}
                </p>
              </div>

              {/* Time */}
              <span className="shrink-0 text-[11px] text-muted-foreground/60 mt-0.5">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
