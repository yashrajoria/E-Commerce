/**
 * TopProducts – Premium top-performing products widget
 * with rank indicators, progress bars, and animated entries
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Product {
  name: string;
  category: string;
  revenue: number;
  units: number;
  trend: number;
  fill: number; // percentage 0-100
  image?: string;
}

const topProducts: Product[] = [
  {
    name: "Premium Wireless Headphones",
    category: "Electronics",
    revenue: 12480,
    units: 312,
    trend: 18.5,
    fill: 100,
  },
  {
    name: "Leather Executive Watch",
    category: "Accessories",
    revenue: 9850,
    units: 197,
    trend: 12.3,
    fill: 79,
  },
  {
    name: "Organic Cotton T-Shirt",
    category: "Apparel",
    revenue: 7620,
    units: 508,
    trend: 8.7,
    fill: 61,
  },
  {
    name: "Smart Fitness Tracker",
    category: "Electronics",
    revenue: 6340,
    units: 158,
    trend: -2.1,
    fill: 51,
  },
  {
    name: "Artisan Coffee Beans",
    category: "Food & Beverage",
    revenue: 4890,
    units: 652,
    trend: 22.4,
    fill: 39,
  },
];

const rankColors = [
  "from-amber-400 to-yellow-500",
  "from-slate-300 to-slate-400",
  "from-amber-700 to-orange-700",
];

export default function TopProducts() {
  return (
    <Card className="glass-effect border-gradient overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center">
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            Top Products
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary gap-1"
          >
            View All <ArrowRight size={12} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.06 * idx }}
              className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
            >
              {/* Rank */}
              <div className="shrink-0">
                {idx < 3 ? (
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${rankColors[idx]} flex items-center justify-center`}
                  >
                    <span className="text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <TrendIndicator value={product.trend} />
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    {product.category} · {product.units} sold
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <Progress
                  value={product.fill}
                  className="h-1.5 bg-white/[0.06]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
