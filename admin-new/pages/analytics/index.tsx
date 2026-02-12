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

const revenueData = [
  { month: "Jan", revenue: 12400, orders: 320, visitors: 8500 },
  { month: "Feb", revenue: 15800, orders: 410, visitors: 9200 },
  { month: "Mar", revenue: 18200, orders: 380, visitors: 10100 },
  { month: "Apr", revenue: 21500, orders: 520, visitors: 11800 },
  { month: "May", revenue: 19800, orders: 460, visitors: 10500 },
  { month: "Jun", revenue: 24100, orders: 580, visitors: 12900 },
  { month: "Jul", revenue: 28400, orders: 640, visitors: 14200 },
  { month: "Aug", revenue: 26200, orders: 590, visitors: 13500 },
  { month: "Sep", revenue: 30100, orders: 710, visitors: 15800 },
  { month: "Oct", revenue: 32500, orders: 750, visitors: 16200 },
  { month: "Nov", revenue: 35800, orders: 820, visitors: 18100 },
  { month: "Dec", revenue: 41200, orders: 920, visitors: 21500 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#8b5cf6" },
  { name: "Clothing", value: 25, color: "#10b981" },
  { name: "Home & Garden", value: 20, color: "#f59e0b" },
  { name: "Sports", value: 12, color: "#3b82f6" },
  { name: "Other", value: 8, color: "#ec4899" },
];

const topProducts = [
  { name: "Wireless Headphones Pro", sales: 1240, revenue: 61960, trend: 12.5 },
  { name: "Smart Watch Ultra", sales: 980, revenue: 48990, trend: 8.3 },
  { name: "Organic Cotton T-Shirt", sales: 856, revenue: 25680, trend: -2.1 },
  { name: "Running Shoes Elite", sales: 720, revenue: 43200, trend: 15.7 },
  { name: "Yoga Mat Premium", sales: 650, revenue: 19500, trend: 5.4 },
];

const trafficSources = [
  { source: "Direct", visitors: 8200, percentage: 35 },
  { source: "Organic Search", visitors: 6500, percentage: 28 },
  { source: "Social Media", visitors: 4100, percentage: 18 },
  { source: "Email", visitors: 2800, percentage: 12 },
  { source: "Referral", visitors: 1600, percentage: 7 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-effect-strong rounded-lg p-3 border border-white/[0.08] text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map(
        (entry: { color: string; name: string; value: number }, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number" &&
            entry.name.toLowerCase().includes("revenue")
              ? `$${entry.value.toLocaleString()}`
              : entry.value.toLocaleString()}
          </p>
        ),
      )}
    </div>
  );
};

const Analytics = () => {
  return (
    <PageLayout
      title="Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8 hidden sm:flex"
          >
            <Calendar size={13} />
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-white/[0.08] hover:bg-white/[0.04] rounded-xl h-8"
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
          value="$306,200"
          icon={DollarSign}
          trend={{ value: 18.2, label: "vs last year" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Total Orders"
          value="7,100"
          icon={ShoppingCart}
          trend={{ value: 12.5, label: "vs last year" }}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Avg Order Value"
          value="$43.13"
          icon={Target}
          trend={{ value: 5.1, label: "vs last year" }}
          gradient="gradient-gold"
          glowClass="glow-gold"
        />
        <StatsCard
          title="Site Visitors"
          value="162,300"
          icon={Eye}
          trend={{ value: 22.8, label: "vs last year" }}
          gradient="gradient-blue"
        />
      </motion.section>

      {/* Tabs */}
      <motion.section variants={pageItem}>
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
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
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
                        tickFormatter={(v) => `$${v / 1000}k`}
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
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg">Order Volume</CardTitle>
                <CardDescription>
                  Monthly orders and visitor trends
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
              <Card className="glass-effect border-white/[0.06] lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Sales by Category</CardTitle>
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
                          {categoryData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {categoryData.map((cat) => (
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
              <Card className="glass-effect border-white/[0.06] lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg">Top Products</CardTitle>
                  <CardDescription>
                    Best performing products by sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topProducts.map((product, i) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.04]"
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
                          ${product.revenue.toLocaleString()}
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
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficSources.map((source, i) => (
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
                          className="text-xs border-white/[0.08]"
                        >
                          {source.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
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
      </motion.section>
    </PageLayout>
  );
};

export default Analytics;
