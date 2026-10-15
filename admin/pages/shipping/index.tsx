/**
 * Premium Shipping Management Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  TableSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/admin/shared/DataStates";
import { motion } from "framer-motion";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useAdminShipping } from "@/lib/hooks/useAdminData";

/** A shipment tracked by the shipping workspace. */
interface Shipment {
  /** Unique shipment identifier. */
  id: string;
  /** Order the shipment fulfils. */
  orderId: string;
  /** Name of the receiving customer. */
  customer: string;
  /** Destination city/region label. */
  destination: string;
  /** Carrier name. */
  carrier: string;
  /** Carrier tracking number. */
  tracking: string;
  /** Current delivery status. */
  status: "processing" | "shipped" | "in-transit" | "delivered" | "delayed";
  /** Estimated delivery date. */
  estimatedDate: string;
  /** Delivery progress as a percentage from 0 to 100. */
  progress: number;
}

/** Badge label, badge classes, and progress-bar color for each {@link Shipment.status}. */
const statusConfig: Record<
  string,
  { label: string; class: string; progressClass: string }
> = {
  processing: {
    label: "Processing",
    class: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    progressClass: "bg-blue-400",
  },
  shipped: {
    label: "Shipped",
    class: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    progressClass: "bg-purple-400",
  },
  "in-transit": {
    label: "In Transit",
    class: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    progressClass: "bg-amber-400",
  },
  delivered: {
    label: "Delivered",
    class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    progressClass: "bg-emerald-400",
  },
  delayed: {
    label: "Delayed",
    class: "bg-red-400/10 text-red-400 border-red-400/20",
    progressClass: "bg-red-400",
  },
};

/**
 * Renders the shipping workspace with delivery KPI stats, search, and carrier shipment cards.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Shipment rows come from {@link useAdminShipping}.
 *
 * @example
 * ```tsx
 * // Route: /shipping — rendered by the Next.js Pages Router.
 * <Shipping />
 * ```
 */
const Shipping = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { shipments, stats, isLoading, error, mutate } = useAdminShipping();

  const filtered = (shipments as Shipment[]).filter(
    (s) =>
      s.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tracking?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.orderId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCount = stats?.total ?? shipments.length;
  const inTransitCount =
    stats?.inTransit ??
    shipments.filter(
      (s: Shipment) => s.status === "in-transit" || s.status === "shipped",
    ).length;
  const deliveredCount =
    stats?.delivered ??
    shipments.filter((s: Shipment) => s.status === "delivered").length;
  const delayedCount =
    stats?.delayed ??
    shipments.filter((s: Shipment) => s.status === "delayed").length;

  return (
    <PageLayout title="Shipping" breadcrumbs={[{ label: "Shipping" }]}>
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Shipments"
          value={totalCount}
          icon={Truck}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="In Transit"
          value={inTransitCount}
          icon={MapPin}
          gradient="gradient-blue"
        />
        <StatsCard
          title="Delivered"
          value={deliveredCount}
          icon={CheckCircle}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Delayed"
          value={delayedCount}
          icon={AlertTriangle}
          gradient="gradient-rose"
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
              placeholder="Search by tracking number, order, or customer..."
              className="pl-10 bg-background border-border rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Shipments List */}
      <motion.section variants={pageItem} className="space-y-4">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <ErrorState
            message="Failed to load live shipping data from database."
            onRetry={() => mutate()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No shipments found"
            description={
              searchQuery
                ? "Try refining your search query."
                : "No shipments are recorded in the database yet."
            }
          />
        ) : (
          filtered.map((shipment, i) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="glass-effect glass-hover border-border transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-purple flex items-center justify-center shrink-0">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {shipment.id}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${statusConfig[shipment.status]?.class || statusConfig.processing.class}`}
                            >
                              {statusConfig[shipment.status]?.label ||
                                shipment.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {shipment.orderId} · {shipment.customer}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-muted-foreground">
                          Carrier:{" "}
                          <span className="text-foreground font-medium">
                            {shipment.carrier}
                          </span>
                        </p>
                        <p className="text-muted-foreground font-mono">
                          {shipment.tracking}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {shipment.destination}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">
                            ETA: {shipment.estimatedDate}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={shipment.progress}
                        className="h-2 bg-muted"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">
                        {shipment.progress}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.section>
    </PageLayout>
  );
};

export default Shipping;

import type { GetServerSidePropsContext } from "next";
/**
 * Server-side admin auth gate for the Shipping route.
 *
 * @param ctx - Next.js server-side context for the incoming request, including `req`/`res` and cookies.
 * @returns The {@link requireAdmin} result: `props` with the authenticated admin user, or a redirect to `/` / `/?error=admin_required` when the session is missing or not an admin.
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
