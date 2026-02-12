import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ShoppingCart, Package } from "lucide-react";

const tabs = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
];

function AnalyticsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Revenue",
            value: "$128,430",
            sub: "+24.5% from last month",
          },
          {
            label: "Active Users",
            value: "8,421",
            sub: "+15.3% from last month",
          },
          {
            label: "Conversion Rate",
            value: "4.82%",
            sub: "+0.8% from last month",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-emerald-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Revenue Overview</h4>
          <span className="text-xs text-muted-foreground">Last 12 months</span>
        </div>
        <div className="flex items-end gap-1 h-32">
          {[40, 55, 45, 60, 75, 65, 80, 90, 70, 85, 95, 100].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-purple-500/50 to-purple-500/10"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((m) => (
            <span
              key={m}
              className="text-[10px] text-muted-foreground/50 flex-1 text-center"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  const orders = [
    {
      id: "#ORD-7291",
      customer: "Sarah Johnson",
      amount: "$245.00",
      status: "Completed",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "#ORD-7290",
      customer: "Mike Chen",
      amount: "$189.50",
      status: "Processing",
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      id: "#ORD-7289",
      customer: "Emily Davis",
      amount: "$432.00",
      status: "Completed",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "#ORD-7288",
      customer: "Alex Rivera",
      amount: "$78.25",
      status: "Pending",
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      id: "#ORD-7287",
      customer: "Lisa Wang",
      amount: "$567.00",
      status: "Completed",
      color: "text-emerald-400 bg-emerald-500/10",
    },
  ];

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
      <div className="grid grid-cols-4 px-4 py-3 border-b border-white/[0.06] text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Amount</span>
        <span>Status</span>
      </div>
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="grid grid-cols-4 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors text-sm"
        >
          <span className="font-mono text-purple-300">{order.id}</span>
          <span>{order.customer}</span>
          <span className="font-medium">{order.amount}</span>
          <span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium ${order.color}`}
            >
              {order.status}
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ProductsView() {
  const products = [
    { name: "Premium Headphones", sku: "HD-001", stock: 245, price: "$299.99" },
    { name: "Wireless Mouse", sku: "MS-042", stock: 18, price: "$79.99" },
    {
      name: "Mechanical Keyboard",
      sku: "KB-015",
      stock: 132,
      price: "$149.99",
    },
    { name: "Ultra Monitor 4K", sku: "MN-007", stock: 56, price: "$599.99" },
    { name: "USB-C Hub Pro", sku: "HB-023", stock: 320, price: "$49.99" },
  ];

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
      <div className="grid grid-cols-4 px-4 py-3 border-b border-white/[0.06] text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Product</span>
        <span>SKU</span>
        <span>Stock</span>
        <span>Price</span>
      </div>
      {products.map((product, i) => (
        <motion.div
          key={product.sku}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="grid grid-cols-4 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors text-sm"
        >
          <span className="font-medium">{product.name}</span>
          <span className="text-muted-foreground font-mono">{product.sku}</span>
          <span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                product.stock < 30
                  ? "text-red-400 bg-red-500/10"
                  : "text-emerald-400 bg-emerald-500/10"
              }`}
            >
              {product.stock} units
            </span>
          </span>
          <span className="font-medium">{product.price}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("analytics");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="preview" className="relative py-32 overflow-hidden">
      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect border border-emerald-500/20 text-xs font-medium text-emerald-300 mb-6">
            LIVE PREVIEW
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Explore the dashboard interface and experience the power of
            real-time data management.
          </p>
        </motion.div>

        {/* Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Glow */}
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/5 via-transparent to-emerald-500/5 rounded-3xl blur-3xl" />

          <div className="relative glass-effect-strong rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
            {/* Window Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white/[0.04] border border-white/[0.06] h-9">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="text-xs gap-1.5 data-[state=active]:bg-white/[0.08] data-[state=active]:text-foreground px-3"
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="w-20" />
            </div>

            {/* Tab Content */}
            <div className="p-5 min-h-[360px]">
              {activeTab === "analytics" && <AnalyticsView />}
              {activeTab === "orders" && <OrdersView />}
              {activeTab === "products" && <ProductsView />}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
