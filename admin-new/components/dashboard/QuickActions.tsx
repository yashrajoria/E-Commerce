/**
 * QuickActions – Premium quick-action card grid
 * for common admin operations
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
  color: string;
  description: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Product",
    icon: Plus,
    href: "/products/add-product",
    color: "from-violet-600 to-purple-600",
    description: "Create new listing",
  },
  {
    label: "Export Data",
    icon: Download,
    href: "#",
    color: "from-emerald-600 to-teal-600",
    description: "Download reports",
  },
  {
    label: "Bulk Upload",
    icon: Upload,
    href: "#",
    color: "from-blue-600 to-indigo-600",
    description: "Import CSV/Excel",
  },
  {
    label: "View Reports",
    icon: FileText,
    href: "#",
    color: "from-amber-500 to-orange-500",
    description: "Analytics overview",
  },
];

export default function QuickActions() {
  return (
    <Card className="glass-effect border-gradient overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((action, idx) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.06 * idx }}
            >
              <Link
                href={action.href}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 text-center"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <action.icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
