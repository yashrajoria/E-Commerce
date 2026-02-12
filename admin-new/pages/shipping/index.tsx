/**
 * Premium Shipping Management Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  destination: string;
  carrier: string;
  tracking: string;
  status: "processing" | "shipped" | "in-transit" | "delivered" | "delayed";
  estimatedDate: string;
  progress: number;
}

const mockShipments: Shipment[] = [
  {
    id: "SHP-001",
    orderId: "ORD-1234",
    customer: "John Doe",
    destination: "New York, NY",
    carrier: "FedEx",
    tracking: "FDX123456789",
    status: "in-transit",
    estimatedDate: "2024-03-22",
    progress: 65,
  },
  {
    id: "SHP-002",
    orderId: "ORD-1235",
    customer: "Jane Smith",
    destination: "Los Angeles, CA",
    carrier: "UPS",
    tracking: "UPS987654321",
    status: "shipped",
    estimatedDate: "2024-03-24",
    progress: 30,
  },
  {
    id: "SHP-003",
    orderId: "ORD-1236",
    customer: "Bob Wilson",
    destination: "Chicago, IL",
    carrier: "USPS",
    tracking: "USPS456789123",
    status: "delivered",
    estimatedDate: "2024-03-18",
    progress: 100,
  },
  {
    id: "SHP-004",
    orderId: "ORD-1237",
    customer: "Alice Brown",
    destination: "Houston, TX",
    carrier: "DHL",
    tracking: "DHL789123456",
    status: "delayed",
    estimatedDate: "2024-03-20",
    progress: 45,
  },
  {
    id: "SHP-005",
    orderId: "ORD-1238",
    customer: "Charlie Davis",
    destination: "Phoenix, AZ",
    carrier: "FedEx",
    tracking: "FDX321654987",
    status: "processing",
    estimatedDate: "2024-03-26",
    progress: 10,
  },
];

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

const Shipping = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockShipments.filter(
    (s) =>
      s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const inTransitCount = mockShipments.filter(
    (s) => s.status === "in-transit" || s.status === "shipped",
  ).length;
  const deliveredCount = mockShipments.filter(
    (s) => s.status === "delivered",
  ).length;
  const delayedCount = mockShipments.filter(
    (s) => s.status === "delayed",
  ).length;

  return (
    <PageLayout title="Shipping" breadcrumbs={[{ label: "Shipping" }]}>
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Shipments"
          value={mockShipments.length}
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
              placeholder="Search by tracking number or customer..."
              className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Shipments */}
      <motion.section variants={pageItem} className="space-y-4">
        {filtered.map((shipment, i) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="glass-effect border-white/[0.06] hover:bg-white/[0.02] transition-colors">
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
                            className={`text-[10px] ${statusConfig[shipment.status].class}`}
                          >
                            {statusConfig[shipment.status].label}
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
                      className="h-2 bg-white/[0.04]"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">
                      {shipment.progress}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </PageLayout>
  );
};

export default Shipping;
