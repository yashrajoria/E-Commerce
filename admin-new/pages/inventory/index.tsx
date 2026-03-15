import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/empty-state";
import { AnimatePresence, motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Search,
  Warehouse,
  RefreshCw,
  Download,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface InventoryItem {
  product_id: string;
  available: number;
  reserved: number;
  threshold: number;
  updated_at: string;
  status: "in-stock" | "low" | "out";
}

const statusConfig: Record<string, { label: string; class: string }> = {
  "in-stock": {
    label: "In Stock",
    class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
  low: {
    label: "Low Stock",
    class: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  out: {
    label: "Out of Stock",
    class: "bg-red-400/10 text-red-400 border-red-400/20",
  },
};

function getStockStatus(item: { available: number; threshold: number }): "in-stock" | "low" | "out" {
  if (item.available === 0) return "out";
  if (item.threshold > 0 && item.available <= item.threshold) return "low";
  return "in-stock";
}

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/inventory", {
          withCredentials: true,
          params: { page: 1, page_size: 100 },
        });
        const items = (res.data?.inventory || []).map((item: any) => ({
          ...item,
          status: getStockStatus(item),
        }));
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventoryItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filtered = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.product_id
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && item.status === activeTab;
    });
  }, [inventoryItems, searchQuery, activeTab]);

  const inStockCount = inventoryItems.filter(
    (i) => i.status === "in-stock",
  ).length;
  const lowStockCount = inventoryItems.filter((i) => i.status === "low").length;
  const outOfStockCount = inventoryItems.filter(
    (i) => i.status === "out",
  ).length;
  const totalStock = inventoryItems.reduce((sum, i) => sum + i.available, 0);

  return (
    <PageLayout
      title="Inventory"
      breadcrumbs={[{ label: "Inventory" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
          >
            <Download size={13} />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
          >
            <RefreshCw size={13} />
            Restock
          </Button>
        </div>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Stock"
          value={loading ? "—" : totalStock}
          icon={Warehouse}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="In Stock"
          value={loading ? "—" : inStockCount}
          icon={Package}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Low Stock"
          value={loading ? "—" : lowStockCount}
          icon={TrendingDown}
          gradient="gradient-amber"
        />
        <StatsCard
          title="Out of Stock"
          value={loading ? "—" : outOfStockCount}
          icon={AlertTriangle}
          gradient="gradient-rose"
        />
      </motion.section>

      {/* Low Stock Alerts */}
      {!loading && lowStockCount + outOfStockCount > 0 && (
        <motion.section variants={pageItem}>
          <Card className="glass-effect border-amber-500/10 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inventoryItems
                .filter((i) => i.status === "low" || i.status === "out")
                .map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          statusConfig[item.status].class + " text-[10px]"
                        }
                      >
                        {statusConfig[item.status].label}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium font-mono">{item.product_id.substring(0, 8)}...</p>
                        <p className="text-xs text-muted-foreground">
                          Available: {item.available} | Threshold: {item.threshold}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {item.available} / {item.threshold}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Search & Tabs */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product ID..."
                className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent gap-1 h-auto p-0">
                {[
                  { v: "all", l: "All" },
                  { v: "in-stock", l: "In Stock" },
                  { v: "low", l: "Low" },
                  { v: "out", l: "Out" },
                ].map(({ v, l }) => (
                  <TabsTrigger
                    key={v}
                    value={v}
                    className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-3 py-1.5 text-xs transition-all"
                  >
                    {l}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </motion.section>

      {/* Inventory Table */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.section
            key="loading"
            variants={pageItem}
            className="flex items-center justify-center py-16"
          >
            <LoadingSpinner />
          </motion.section>
        ) : filtered.length === 0 ? (
          <motion.section key="empty" variants={pageItem}>
            <div className="glass-effect rounded-xl">
              <EmptyState
                icon={Package}
                title="No inventory found"
                description={
                  searchQuery
                    ? "Try adjusting your search criteria"
                    : "Your inventory will appear here"
                }
              />
            </div>
          </motion.section>
        ) : (
          <motion.section key="table" variants={pageItem}>
            <Card className="glass-effect overflow-hidden border-white/[0.06]">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.04]">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Product ID
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Available
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Reserved
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stock Level
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Last Updated
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item, index) => (
                      <motion.tr
                        key={item.product_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg gradient-purple flex items-center justify-center shrink-0">
                              <Package className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-sm font-mono">
                              {item.product_id.substring(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {item.available}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.reserved}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 w-28">
                            <div className="flex items-center justify-between text-xs">
                              <span>{item.available}</span>
                              <span className="text-muted-foreground">
                                / {item.threshold || "∞"}
                              </span>
                            </div>
                            <Progress
                              value={
                                item.threshold > 0
                                  ? Math.min(100, (item.available / (item.threshold * 3)) * 100)
                                  : 100
                              }
                              className="h-1.5 bg-white/[0.04]"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusConfig[item.status].class + " text-xs"}
                          >
                            {statusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Inventory;
