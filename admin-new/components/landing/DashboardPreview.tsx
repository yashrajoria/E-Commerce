import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ShoppingCart, Package, Activity, Users, Zap, TrendingUp } from "lucide-react";

const tabs = [
  { id: "analytics", label: "Intelligence", icon: Activity },
  { id: "orders", label: "Operations", icon: ShoppingCart },
  { id: "products", label: "Inventory", icon: Package },
];

function AnalyticsView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Gross Volume",
            value: "£142.8k",
            sub: "+24.5%",
            icon: TrendingUp,
            color: "text-primary"
          },
          {
            label: "Active Sessions",
            value: "8,421",
            sub: "+15.3%",
            icon: Users,
            color: "text-accent"
          },
          {
            label: "Conversion",
            value: "4.82%",
            sub: "+0.8%",
            icon: Zap,
            color: "text-emerald-400"
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color} opacity-70`} />
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className={`text-[10px] font-bold mt-1 ${stat.sub.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.sub} <span className="text-muted-foreground/40 font-normal ml-1">vs prev.</span>
            </p>
          </div>
        ))}
      </div>
      
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold tracking-tight">Revenue Stream</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Real-time Attribution</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Direct</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Social</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-1.5 h-36">
          {[40, 55, 45, 60, 75, 65, 80, 90, 70, 85, 95, 100, 85, 75, 60, 45, 55, 70, 85, 100].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-primary/10 relative group/bar"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: i * 0.03, ease: "circOut" }}
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </motion.div>
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
      amount: "£245.00",
      status: "Settled",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "#ORD-7290",
      customer: "Mike Chen",
      amount: "£189.50",
      status: "In Transit",
      color: "text-accent bg-accent/10",
    },
    {
      id: "#ORD-7289",
      customer: "Emily Davis",
      amount: "£432.00",
      status: "Settled",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "#ORD-7288",
      customer: "Alex Rivera",
      amount: "£78.25",
      status: "Awaiting Auth",
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
        <span>Identifier</span>
        <span>Customer Entity</span>
        <span>Value</span>
        <span>Status</span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid grid-cols-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
          >
            <span className="font-mono text-xs font-bold text-primary/80">{order.id}</span>
            <span className="text-sm font-medium">{order.customer}</span>
            <span className="text-sm font-bold tracking-tight">{order.amount}</span>
            <div>
              <span
                className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.color}`}
              >
                {order.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProductsView() {
  const products = [
    { name: "Premium Headphones", sku: "SKU-HDP-001", stock: 245, price: "£299" },
    { name: "Wireless Mouse", sku: "SKU-MS-042", stock: 18, price: "£79" },
    {
      name: "Mechanical Keyboard",
      sku: "SKU-KB-015",
      stock: 132,
      price: "£149",
    },
    { name: "Ultra Monitor 4K", sku: "SKU-MN-007", stock: 56, price: "£599" },
  ];

  return (
    <div className="rounded-2xl bg-white/[0.01] border border-white/[0.05] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
        <span>Asset Name</span>
        <span>Reference</span>
        <span>Availability</span>
        <span>Unit Price</span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {products.map((product, i) => (
          <motion.div
            key={product.sku}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid grid-cols-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
          >
            <span className="text-sm font-bold tracking-tight">{product.name}</span>
            <span className="text-xs font-mono text-muted-foreground/60">{product.sku}</span>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden w-16">
                  <motion.div 
                    className={`h-full ${product.stock < 30 ? 'bg-rose-500' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (product.stock / 250) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{product.stock}</span>
              </div>
            </div>
            <span className="text-sm font-bold">{product.price}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("analytics");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="preview" className="relative py-32 overflow-hidden bg-white/[0.01]">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.02] to-transparent pointer-events-none" />

      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full glass-effect border border-white/[0.08] text-[10px] font-bold tracking-[0.2em] text-primary mb-6 uppercase">
            Platform Engine
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            High-Performance <span className="text-gradient">Operations</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground font-light leading-relaxed">
            Experience an interface built for precision. Our dashboard provides 
            unparalleled visibility into every layer of your commerce stack.
          </p>
        </motion.div>

        {/* Dashboard Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Ambient Glows */}
          <div className="absolute -inset-20 bg-primary/5 rounded-[4rem] blur-[100px] pointer-events-none" />
          
          <div className="relative glass-effect-strong rounded-[2rem] border border-white/[0.1] overflow-hidden shadow-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05] bg-white/[0.01]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-white/5" />
                <div className="w-3 h-3 rounded-full bg-white/5" />
                <div className="w-3 h-3 rounded-full bg-white/5" />
              </div>

              {/* Enhanced Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-white/[0.03] border border-white/[0.08] h-11 p-1 rounded-xl">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="text-[11px] font-bold uppercase tracking-wider gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-5 transition-all"
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-4">
                 <div className="hidden lg:flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">System Nominal</span>
                 </div>
              </div>
            </div>

            {/* Viewport */}
            <div className="p-8 min-h-[420px] bg-gradient-to-b from-transparent to-white/[0.01]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "analytics" && <AnalyticsView />}
                  {activeTab === "orders" && <OrdersView />}
                  {activeTab === "products" && <ProductsView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
