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
import { TableSkeleton, EmptyState, ErrorState } from "@/components/admin/shared/DataStates";
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
import { useAdminActivityLogs } from "@/lib/hooks/useAdminData";

interface LogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  type: "create" | "update" | "delete" | "auth" | "system";
  timestamp: string;
  ip: string;
}

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
  const { logs, stats, isLoading, error, mutate } = useAdminActivityLogs();

  const filtered = (logs as LogEntry[]).filter((log) => {
    const matchesSearch =
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchQuery.toLowerCase());
    if (typeFilter === "all") return matchesSearch;
    return matchesSearch && log.type === typeFilter;
  });

  const totalCount = stats?.total ?? logs.length;
  const todayCount = stats?.today ?? logs.length;
  const systemCount = logs.filter((l: LogEntry) => l.type === "system").length;

  return (
    <PageLayout
      title="Activity Logs"
      breadcrumbs={[{ label: "Activity Logs" }]}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs border-border hover:bg-accent rounded-xl h-8"
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
          value={totalCount}
          icon={Activity}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Recent Events"
          value={todayCount}
          icon={Clock}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Security / Auth"
          value={stats?.security ?? logs.filter((l: LogEntry) => l.type === "auth").length}
          icon={User}
          gradient="gradient-blue"
        />
        <StatsCard
          title="System Events"
          value={systemCount}
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
                placeholder="Search audit trail by user, action, target..."
                className="pl-10 bg-background border-border rounded-xl h-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-background border-border rounded-xl h-9 text-xs">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="glass-effect-strong border-border">
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
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <ErrorState message="Failed to load activity logs from database." onRetry={() => mutate()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No activity logs found"
            description={searchQuery ? "Try refining your search terms." : "No operational activity recorded in the database yet."}
          />
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-1">
              {filtered.map((log, i) => {
                const config = typeConfig[log.type] || typeConfig.system;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative flex items-start gap-4 pl-0 py-2"
                  >
                    {/* Icon */}
                    <div
                      className={`relative z-10 h-[46px] w-[46px] rounded-xl ${config.bg} flex items-center justify-center shrink-0 border border-border`}
                    >
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <Card className="flex-1 glass-effect glass-hover border-border transition-colors">
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
        )}
      </motion.section>
    </PageLayout>
  );
};

export default ActivityLogs;

import type { GetServerSidePropsContext } from "next";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
