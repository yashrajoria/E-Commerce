/**
 * Premium Activity Logs Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  User,
  Settings,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Plus,
  LogIn,
} from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  type: "create" | "update" | "delete" | "auth" | "system";
  timestamp: string;
  ip: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    user: "Admin",
    action: "Updated product price",
    target: "Wireless Headphones Pro",
    type: "update",
    timestamp: "2024-03-20 14:32:15",
    ip: "192.168.1.100",
  },
  {
    id: "2",
    user: "Admin",
    action: "Created new category",
    target: "Summer Collection",
    type: "create",
    timestamp: "2024-03-20 13:15:42",
    ip: "192.168.1.100",
  },
  {
    id: "3",
    user: "Admin",
    action: "Deleted expired coupon",
    target: "SUMMER15",
    type: "delete",
    timestamp: "2024-03-20 12:08:33",
    ip: "192.168.1.100",
  },
  {
    id: "4",
    user: "Admin",
    action: "Signed in",
    target: "Admin Dashboard",
    type: "auth",
    timestamp: "2024-03-20 09:00:10",
    ip: "192.168.1.100",
  },
  {
    id: "5",
    user: "System",
    action: "Automatic backup completed",
    target: "Database",
    type: "system",
    timestamp: "2024-03-20 03:00:00",
    ip: "127.0.0.1",
  },
  {
    id: "6",
    user: "Admin",
    action: "Updated order status",
    target: "ORD-1234",
    type: "update",
    timestamp: "2024-03-19 16:45:22",
    ip: "192.168.1.100",
  },
  {
    id: "7",
    user: "Admin",
    action: "Added new product",
    target: "Bluetooth Speaker Mini",
    type: "create",
    timestamp: "2024-03-19 15:20:11",
    ip: "192.168.1.100",
  },
  {
    id: "8",
    user: "Admin",
    action: "Updated shipping settings",
    target: "Settings",
    type: "update",
    timestamp: "2024-03-19 11:30:45",
    ip: "192.168.1.100",
  },
  {
    id: "9",
    user: "System",
    action: "Low stock alert triggered",
    target: "Smart Watch Ultra",
    type: "system",
    timestamp: "2024-03-19 08:15:00",
    ip: "127.0.0.1",
  },
  {
    id: "10",
    user: "Admin",
    action: "Signed out",
    target: "Admin Dashboard",
    type: "auth",
    timestamp: "2024-03-18 18:00:33",
    ip: "192.168.1.100",
  },
];

const typeConfig: Record<
  string,
  { icon: typeof Activity; color: string; bg: string }
> = {
  create: { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  update: { icon: Edit, color: "text-blue-400", bg: "bg-blue-400/10" },
  delete: { icon: Trash2, color: "text-red-400", bg: "bg-red-400/10" },
  auth: { icon: LogIn, color: "text-purple-400", bg: "bg-purple-400/10" },
  system: { icon: Settings, color: "text-amber-400", bg: "bg-amber-400/10" },
};

const ActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = mockLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    if (typeFilter === "all") return matchesSearch;
    return matchesSearch && log.type === typeFilter;
  });

  const todayCount = mockLogs.filter((l) =>
    l.timestamp.startsWith("2024-03-20"),
  ).length;

  return (
    <PageLayout
      title="Activity Logs"
      breadcrumbs={[{ label: "Activity Logs" }]}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8"
        >
          <Download size={13} />
          Export Logs
        </Button>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Activities"
          value={mockLogs.length}
          icon={Activity}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Today"
          value={todayCount}
          icon={Clock}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Users Active"
          value={1}
          icon={User}
          gradient="gradient-blue"
        />
        <StatsCard
          title="System Events"
          value={mockLogs.filter((l) => l.type === "system").length}
          icon={Settings}
          gradient="gradient-amber"
        />
      </motion.section>

      {/* Filters */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity..."
                className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-white/[0.04] border-white/[0.08] rounded-xl h-9 text-xs">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="glass-effect-strong border-white/[0.08]">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="create">Created</SelectItem>
                <SelectItem value="update">Updated</SelectItem>
                <SelectItem value="delete">Deleted</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section variants={pageItem}>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-1">
            {filtered.map((log, i) => {
              const config = typeConfig[log.type];
              const Icon = config.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex items-start gap-4 pl-0 py-2"
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 h-[46px] w-[46px] rounded-xl ${config.bg} flex items-center justify-center shrink-0 border border-white/[0.06]`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 glass-effect border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold">{log.user}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              {log.action}{" "}
                            </span>
                            <span className="font-medium text-gradient">
                              {log.target}
                            </span>
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock size={10} />
                              {log.timestamp}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {log.ip}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${config.bg} ${config.color} border-transparent`}
                        >
                          {log.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </PageLayout>
  );
};

export default ActivityLogs;
