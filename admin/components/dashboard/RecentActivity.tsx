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
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  icon: LucideIcon;
  variant: "success" | "warning" | "error" | "info" | "neutral";
}

export default function RecentActivity({ activities }: { activities: Array<{ id: string; type: string; description: string; time: string; variant: string }> }) {
  if (!activities || activities.length === 0) return null;

  const mappedActivities: Activity[] = activities.map((act) => {
    let icon = Clock;
    
    // Naively map backend types to icons
    const typeStr = act.type?.toLowerCase() || "";
    if (typeStr.includes("order")) icon = ShoppingCart;
    if (typeStr.includes("payment")) icon = Wallet;
    if (typeStr.includes("stock") || typeStr.includes("inventory") || typeStr.includes("product")) icon = Package;
    if (typeStr.includes("customer") || typeStr.includes("user")) icon = Users;
    if (act.variant === "warning" || act.variant === "error") icon = AlertTriangle;
    if (act.variant === "success") icon = CheckCircle2;

    return {
      id: act.id,
      type: act.type,
      description: act.description,
      time: act.time,
      icon,
      variant: act.variant as "success" | "warning" | "error" | "info" | "neutral",
    };
  });

  return (
    <Card className="bg-card border border-border shadow-2xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            Operational Audit Trail
          </CardTitle>
          <Link href="/activity-logs">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7 px-2 font-medium"
            >
              Full Log <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="divide-y divide-border/60">
          {mappedActivities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id + idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.03 * idx }}
                className="flex items-center justify-between gap-4 py-2.5 px-2 hover:bg-muted/40 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground border border-border">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <StatusBadge
                  variant={activity.variant}
                  label={activity.type}
                  size="sm"
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
