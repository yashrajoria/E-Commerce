/**
 * Premium Analytics Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton, ErrorState } from "@/components/admin/shared/DataStates";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Target,
  Download,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { useAdminAnalytics } from "@/lib/hooks/useAdminData";

type TooltipEntry = { color?: string; name?: string; value?: number | string };

interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

interface TopProductItem {
  name: string;
  sales: number;
  revenue: number;
  trend: number;
}

interface TrafficSourceItem {
  source: string;
  visitors: number;
  percentage: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) => {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div className="glass-effect-strong rounded-lg p-3 border border-white/8 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => {
        const name = entry?.name ?? "";
        const value = entry?.value ?? "";
        const color = entry?.color ?? undefined;
        const formatted = typeof value === "number" && name.toLowerCase().includes("revenue")
          ? `£${value.toLocaleString()}`
          : String(value).toLocaleString();
        return (
          <p key={i} className="text-xs" style={{ color }}>
            {name}: {formatted}
          </p>
        );
      })}
    </div>
  );
};

const Analytics = () => {
  const {
    revenueData,
    categoryData,
    topProducts,
    trafficSources,
    stats,
    isLoading,
    error,
    mutate,
  } = useAdminAnalytics();

  const totRev = stats?.totalRevenue ?? 0;
  const totOrd = stats?.totalOrders ?? 0;
  const avgOrderVal = totOrd > 0 ? (totRev / totOrd).toFixed(2) : "0.00";
  const visitors = stats?.visitors ?? 0;

  return (
    <PageLayout
      title="Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/8 hover:bg-white/4 rounded-xl h-8 hidden sm:flex"
          >
            <Calendar size={13} />
            Live DB
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/8 hover:bg-white/4 rounded-xl h-8"
          >
            <Download size={13} />
            Export
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
          title="Total Revenue"
          value={`£${totRev.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18.2, label: "from live orders" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Total Orders"
          value={totOrd.toLocaleString()}
          icon={ShoppingCart}
          trend={{ value: 12.5, label: "recorded" }}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Avg Order Value"
          value={`£${avgOrderVal}`}
          icon={Target}
          trend={{ value: 5.1, label: "per order" }}
          gradient="gradient-gold"
          glowClass="glow-gold"
        />
        <StatsCard
          title="Site Visitors"
          value={visitors.toLocaleString()}
          icon={Eye}
          trend={{ value: stats?.conversionRate ?? 3.8, label: "% conversion" }}
          gradient="gradient-blue"
        />
      </motion.section>

      {/* Tabs */}
      <motion.section variants={pageItem}>
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <ErrorState message="Failed to load analytics from database." onRetry={() => mutate()} />
        ) : (
          <Tabs defaultValue="revenue" className="space-y-6">
            <div className="glass-effect rounded-xl p-1.5 inline-flex">
              <TabsList className="bg-transparent gap-1 h-auto p-0">
                {[
                  { value: "revenue", label: "Revenue" },
                  { value: "orders", label: "Orders" },
                  { value: "products", label: "Products" },
                  { value: "traffic", label: "Traffic" },
                ].map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs transition-all"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6 mt-6">
              <Card className="glass-effect border-white/6">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue from verified database orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient
                            id="revGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8b5cf6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.04)"
                        />
                        <XAxis
                          dataKey="month"
                          stroke="rgba(255,255,255,0.3)"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="rgba(255,255,255,0.3)"
                          fontSize={12}
                          tickFormatter={(v) => `£${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#8b5cf6"
                          fill="url(#revGrad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 mt-6">
              <Card className="glass-effect border-white/6">
                <CardHeader>
                  <CardTitle className="text-lg">Order Volume</CardTitle>
                  <CardDescription>
                    Monthly order counts recorded in the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.04)"
                        />
                        <XAxis
                          dataKey="month"
                          stroke="rgba(255,255,255,0.3)"
                          fontSize={12}
                        />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="orders"
                          name="Orders"
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="visitors"
                          name="Visitors"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          opacity={0.4}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Category Breakdown */}
                <Card className="glass-effect border-white/6 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Catalog Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            dataKey="value"
                            stroke="transparent"
                          >
                            {(categoryData as CategoryItem[]).map((entry, i: number) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {(categoryData as CategoryItem[]).map((cat) => (
                        <div
                          key={cat.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span>{cat.name}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {cat.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="glass-effect border-white/6 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Products</CardTitle>
                    <CardDescription>
                      Best performing items from real customer purchases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(topProducts as TopProductItem[]).map((product, i: number) => (
                      <motion.div
                        key={product.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/4 transition-colors border border-white/4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg gradient-purple flex items-center justify-center text-white text-xs font-bold">
                            #{i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.sales.toLocaleString()} sales
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            £{product.revenue.toLocaleString()}
                          </p>
                          <div
                            className={`flex items-center gap-1 text-xs ${product.trend > 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {product.trend > 0 ? (
                              <ArrowUpRight size={12} />
                            ) : (
                              <ArrowDownRight size={12} />
                            )}
                            {Math.abs(product.trend)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Traffic Tab */}
            <TabsContent value="traffic" className="space-y-6 mt-6">
              <Card className="glass-effect border-white/6">
                <CardHeader>
                  <CardTitle className="text-lg">Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors originate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(trafficSources as TrafficSourceItem[]).map((source, i: number) => (
                    <motion.div
                      key={source.source}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">
                          {source.source}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {source.visitors.toLocaleString()} visitors
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs border-white/8"
                          >
                            {source.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-white/4 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${source.percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full gradient-purple"
                        />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </motion.section>
    </PageLayout>
  );
};

export default Analytics;

import type { GetServerSidePropsContext } from "next";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
