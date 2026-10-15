/**
 * Premium Returns Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/admin/shared/DataStates";
import { motion } from "framer-motion";
import {
  RotateCcw,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAdminReturns } from "@/lib/hooks/useAdminData";

interface ReturnItem {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestDate: string;
  amount: number;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: {
    label: "Pending",
    class: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  approved: {
    label: "Approved",
    class: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  },
  rejected: {
    label: "Rejected",
    class: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  completed: {
    label: "Completed",
    class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
};

const Returns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { returns, stats, isLoading, error, mutate } = useAdminReturns();

  const filtered = (returns as ReturnItem[]).filter(
    (r) =>
      r.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCount = stats?.total ?? returns.length;
  const pendingCount = stats?.pending ?? returns.filter((r: ReturnItem) => r.status === "pending").length;
  const approvedCount = returns.filter((r: ReturnItem) => r.status === "approved").length;
  const totalRefunded = stats?.refunded ?? returns
    .filter((r: ReturnItem) => r.status === "completed" || r.status === "approved")
    .reduce((s: number, r: ReturnItem) => s + r.amount, 0);

  return (
    <PageLayout title="Returns" breadcrumbs={[{ label: "Returns" }]}>
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Returns"
          value={totalCount}
          icon={RotateCcw}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          gradient="gradient-amber"
        />
        <StatsCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle}
          gradient="gradient-blue"
        />
        <StatsCard
          title="Refunded"
          value={`£${Number(totalRefunded).toFixed(2)}`}
          icon={DollarSign}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
      </motion.section>

      {/* Search */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by return ID, order, product, or customer..."
              className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Table */}
      <motion.section variants={pageItem}>
        <Card className="glass-effect overflow-hidden border-white/[0.06]">
          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <TableSkeleton rows={5} />
            ) : error ? (
              <ErrorState message="Failed to load returns from database." onRetry={() => mutate()} />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No returns found"
                description={searchQuery ? "Try refining your search terms." : "No return requests recorded in the database yet."}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.04]">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Return ID
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Product
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Reason
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell>
                        <span className="font-mono text-xs font-semibold">
                          {item.id}
                        </span>
                        <span className="block text-[11px] text-muted-foreground font-mono">
                          {item.orderId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{item.customer}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.product}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {item.reason}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold font-mono">
                          £{Number(item.amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${statusConfig[item.status]?.class || statusConfig.pending.class}`}
                        >
                          {statusConfig[item.status]?.label || item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs hover:bg-white/[0.06] rounded-lg h-7"
                        >
                          Review
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </PageLayout>
  );
};

export default Returns;

import type { GetServerSidePropsContext } from "next";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
