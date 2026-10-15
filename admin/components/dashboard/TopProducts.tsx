/**
 * TopProducts – Operational top-performing products widget
 * with clear rank badges, progress bars, and high information density
 */
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendIndicator } from "@/components/ui/trend-indicator";
import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface TopProduct {
  name: string;
  category: string;
  revenue: number;
  units: number;
  trend: number;
  fill: number; // percentage 0-100
  image?: string;
}

/** Props accepted by {@link TopProducts}. */
interface TopProductsProps {
  /** Ranked products to display, highest performer first. */
  products: TopProduct[];
}

/**
 * Renders the ranked top-products widget with rank badges, progress bars and
 * revenue figures.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <TopProducts products={dashboardData.topProducts} />
 * ```
 */
export default function TopProducts({ products }: TopProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <Card className="bg-card border border-border shadow-2xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <Trophy className="h-4 w-4" />
            </div>
            Top Products
          </CardTitle>
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7 px-2 font-medium"
            >
              View Catalog <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {products.map((product, idx) => (
            <motion.div
              key={product.name + idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.04 * idx }}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
            >
              {/* Rank */}
              <div className="shrink-0">
                {idx < 3 ? (
                  <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-2xs">
                    {idx + 1}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center font-medium text-xs">
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </p>
                  <TrendIndicator value={product.trend} />
                </div>
                <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-muted-foreground">
                  <span>
                    {product.category} · {product.units} sold
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
                <Progress value={product.fill} className="h-1 bg-muted" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
