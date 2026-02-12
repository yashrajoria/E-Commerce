/**
 * Premium Inventory Page
 */
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
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Search,
  Warehouse,
  RefreshCw,
  Download,
} from "lucide-react";
import { useState } from "react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  category: string;
  status: "in-stock" | "low" | "out";
  lastRestocked: string;
}

const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    sku: "WHP-001",
    stock: 145,
    minStock: 20,
    category: "Electronics",
    status: "in-stock",
    lastRestocked: "2024-03-15",
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    sku: "SWU-002",
    stock: 8,
    minStock: 15,
    category: "Electronics",
    status: "low",
    lastRestocked: "2024-02-28",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    sku: "OCT-003",
    stock: 0,
    minStock: 30,
    category: "Clothing",
    status: "out",
    lastRestocked: "2024-01-20",
  },
  {
    id: "4",
    name: "Running Shoes Elite",
    sku: "RSE-004",
    stock: 52,
    minStock: 10,
    category: "Sports",
    status: "in-stock",
    lastRestocked: "2024-03-10",
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    sku: "YMP-005",
    stock: 12,
    minStock: 15,
    category: "Sports",
    status: "low",
    lastRestocked: "2024-03-01",
  },
  {
    id: "6",
    name: "Bluetooth Speaker Mini",
    sku: "BSM-006",
    stock: 200,
    minStock: 25,
    category: "Electronics",
    status: "in-stock",
    lastRestocked: "2024-03-18",
  },
  {
    id: "7",
    name: "Canvas Backpack",
    sku: "CBP-007",
    stock: 0,
    minStock: 20,
    category: "Accessories",
    status: "out",
    lastRestocked: "2024-02-10",
  },
  {
    id: "8",
    name: "Ceramic Coffee Mug",
    sku: "CCM-008",
    stock: 78,
    minStock: 30,
    category: "Home",
    status: "in-stock",
    lastRestocked: "2024-03-12",
  },
];

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

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && item.status === activeTab;
  });

  const inStockCount = inventoryItems.filter(
    (i) => i.status === "in-stock",
  ).length;
  const lowStockCount = inventoryItems.filter((i) => i.status === "low").length;
  const outOfStockCount = inventoryItems.filter(
    (i) => i.status === "out",
  ).length;
  const totalStock = inventoryItems.reduce((sum, i) => sum + i.stock, 0);

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
          value={totalStock}
          icon={Warehouse}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="In Stock"
          value={inStockCount}
          icon={Package}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockCount}
          icon={TrendingDown}
          gradient="gradient-amber"
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={AlertTriangle}
          gradient="gradient-rose"
        />
      </motion.section>

      {/* Low Stock Alerts */}
      {lowStockCount + outOfStockCount > 0 && (
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
                    key={item.id}
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
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {item.stock} / {item.minStock}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 h-6 text-[10px] rounded-lg border-white/[0.08]"
                      >
                        Reorder
                      </Button>
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
                placeholder="Search by name or SKU..."
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
      <motion.section variants={pageItem}>
        <Card className="glass-effect overflow-hidden border-white/[0.06]">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.04]">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Product
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    SKU
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Category
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Stock Level
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Last Restocked
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
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg gradient-purple flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs border-white/[0.08]"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-28">
                        <div className="flex items-center justify-between text-xs">
                          <span>{item.stock}</span>
                          <span className="text-muted-foreground">
                            / {item.minStock}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            100,
                            (item.stock / (item.minStock * 3)) * 100,
                          )}
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
                      {item.lastRestocked}
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

export default Inventory;
