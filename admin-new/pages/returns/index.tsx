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
import { motion } from "framer-motion";
import {
  RotateCcw,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
} from "lucide-react";
import { useState } from "react";

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

const mockReturns: ReturnItem[] = [
  {
    id: "RTN-001",
    orderId: "ORD-1234",
    customer: "John Doe",
    product: "Wireless Headphones Pro",
    reason: "Defective item",
    status: "pending",
    requestDate: "2024-03-20",
    amount: 49.99,
  },
  {
    id: "RTN-002",
    orderId: "ORD-1189",
    customer: "Jane Smith",
    product: "Smart Watch Ultra",
    reason: "Wrong size",
    status: "approved",
    requestDate: "2024-03-18",
    amount: 199.99,
  },
  {
    id: "RTN-003",
    orderId: "ORD-1156",
    customer: "Bob Wilson",
    product: "Running Shoes Elite",
    reason: "Changed mind",
    status: "rejected",
    requestDate: "2024-03-15",
    amount: 89.99,
  },
  {
    id: "RTN-004",
    orderId: "ORD-1098",
    customer: "Alice Brown",
    product: "Organic Cotton T-Shirt",
    reason: "Wrong color",
    status: "completed",
    requestDate: "2024-03-12",
    amount: 29.99,
  },
  {
    id: "RTN-005",
    orderId: "ORD-1045",
    customer: "Charlie Davis",
    product: "Bluetooth Speaker Mini",
    reason: "Not as described",
    status: "pending",
    requestDate: "2024-03-10",
    amount: 39.99,
  },
];

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

  const filtered = mockReturns.filter(
    (r) =>
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pendingCount = mockReturns.filter((r) => r.status === "pending").length;
  const approvedCount = mockReturns.filter(
    (r) => r.status === "approved",
  ).length;
  const totalRefunded = mockReturns
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <PageLayout title="Returns" breadcrumbs={[{ label: "Returns" }]}>
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Returns"
          value={mockReturns.length}
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
          value={`$${totalRefunded.toFixed(2)}`}
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
              placeholder="Search returns..."
              className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Table */}
      <motion.section variants={pageItem}>
        <Card className="glass-effect overflow-hidden border-white/[0.06]">
          <CardContent className="p-0 overflow-x-auto">
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
                    transition={{ delay: index * 0.04 }}
                    className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell>
                      <div>
                        <span className="text-sm font-mono font-medium">
                          {item.id}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          {item.orderId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.customer}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">
                      {item.product}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.reason}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      ${item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig[item.status].class}`}
                      >
                        {statusConfig[item.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] rounded-lg border-emerald-400/20 text-emerald-400"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] rounded-lg border-red-400/20 text-red-400"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.section>
    </PageLayout>
  );
};

export default Returns;
