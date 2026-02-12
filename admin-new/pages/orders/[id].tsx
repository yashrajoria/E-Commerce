"use client";
/**
 * Premium Order Details Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  Printer,
  RefreshCw,
  Send,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";

type OStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
const statusCfg: Record<OStatus, { icon: React.ReactNode; bg: string }> = {
  pending: {
    icon: <Clock size={14} />,
    bg: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  processing: {
    icon: <RefreshCw size={14} />,
    bg: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  },
  shipped: {
    icon: <Truck size={14} />,
    bg: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  },
  delivered: {
    icon: <CheckCircle size={14} />,
    bg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
  cancelled: {
    icon: <XCircle size={14} />,
    bg: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  },
};
interface OItem {
  _id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}
interface Addr {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
interface Cust {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}
interface ODetail {
  _id: string;
  orderNumber: string;
  customer: Cust;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: OItem[];
  status: OStatus;
  paymentMethod: string;
  paymentId: string;
  shippingAddress: Addr;
  billingAddress: Addr;
  trackingNumber: string;
  notes?: string;
}

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id: orderId } = router.query;
  const [order, setOrder] = useState<ODetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _q = useOrders({ orderId });

  useEffect(() => {
    if (!orderId) return;
    setIsLoading(true);
    const t = setTimeout(() => {
      setOrder({
        _id: "ord-001",
        orderNumber: "ORD-2023-001",
        customer: {
          name: "Yash Rajoria",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          avatar: "",
        },
        date: "2023-05-15T10:30:00",
        total: 129.99,
        subtotal: 119.99,
        tax: 10.0,
        shipping: 0,
        discount: 0,
        items: [
          {
            _id: "i1",
            name: "Premium Wireless Headphones",
            sku: "SKU-001",
            price: 79.99,
            quantity: 1,
            image: "",
          },
          {
            _id: "i2",
            name: "Smart Fitness Tracker",
            sku: "SKU-002",
            price: 39.99,
            quantity: 1,
            image: "",
          },
        ],
        status: "delivered",
        paymentMethod: "Credit Card",
        paymentId: "PAY-123456789",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        billingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        trackingNumber: "TRK-987654321",
        notes: "Please leave at the front door.",
      });
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [orderId]);

  const fmt = (d: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));

  if (isLoading)
    return (
      <PageLayout
        title="Order Details"
        breadcrumbs={[
          { label: "Orders", href: "/orders" },
          { label: "Loading..." },
        ]}
      >
        <motion.div variants={pageItem} className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </motion.div>
      </PageLayout>
    );

  if (!order)
    return (
      <PageLayout
        title="Not Found"
        breadcrumbs={[
          { label: "Orders", href: "/orders" },
          { label: "Not Found" },
        ]}
      >
        <motion.div
          variants={pageItem}
          className="flex flex-col items-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl gradient-purple glow-purple flex items-center justify-center mb-6">
            <Package size={28} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Order not found</h2>
          <Link href="/orders">
            <Button className="gradient-purple text-white rounded-xl border-0 mt-4">
              Back to Orders
            </Button>
          </Link>
        </motion.div>
      </PageLayout>
    );

  const sc = statusCfg[order.status];
  return (
    <PageLayout
      title={`Order ${order.orderNumber}`}
      breadcrumbs={[
        { label: "Orders", href: "/orders" },
        { label: order.orderNumber },
      ]}
      headerActions={
        <Select
          defaultValue={order.status}
          onValueChange={(v) => {
            setOrder({ ...order, status: v as OStatus });
            toast.success(`Status → ${v}`);
          }}
        >
          <SelectTrigger className="w-[150px] h-8 text-xs bg-white/[0.03] border-white/[0.08] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-effect border-white/[0.08]">
            {(
              [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ] as OStatus[]
            ).map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <motion.section
        variants={pageItem}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Status"
          value={order.status}
          icon={Package}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Total"
          value={`$${order.total.toFixed(2)}`}
          icon={DollarSign}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Payment"
          value={order.paymentMethod}
          icon={CreditCard}
          gradient="gradient-blue"
        />
        <StatsCard
          title="Items"
          value={order.items.length}
          icon={Package}
          gradient="gradient-amber"
          glowClass="glow-gold"
        />
      </motion.section>

      <motion.section
        variants={pageItem}
        className="glass-effect rounded-xl p-5"
      >
        <div className="flex flex-wrap gap-6 items-center">
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm capitalize ${sc.bg}`}
          >
            {sc.icon} {order.status}
          </Badge>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} /> {fmt(order.date)}
          </span>
          {order.trackingNumber && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck size={14} /> {order.trackingNumber}
            </span>
          )}
        </div>
      </motion.section>

      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-white/[0.06] overflow-hidden">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Package size={16} className="text-primary" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                      Price
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Qty
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((it) => (
                    <TableRow
                      key={it._id}
                      className="border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                            <Package
                              size={16}
                              className="text-muted-foreground"
                            />
                          </div>
                          <span className="font-medium text-sm">{it.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {it.sku}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${it.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{it.quantity}</TableCell>
                      <TableCell className="text-sm text-right font-medium">
                        ${(it.price * it.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/[0.06]">
            <CardHeader className="border-b border-white/[0.04] pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign size={16} className="text-primary" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-emerald-400">
                    -${order.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <Separator className="bg-white/[0.06]" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-gradient">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect border-white/[0.06]">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.04]">
              <CardTitle className="text-sm font-semibold">Customer</CardTitle>
              <User size={14} className="text-primary" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {order.customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{order.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
              </div>
              {order.customer.phone && (
                <p className="text-xs text-muted-foreground">
                  {order.customer.phone}
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/[0.06]">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.04]">
              <CardTitle className="text-sm font-semibold">Shipping</CardTitle>
              <MapPin size={14} className="text-primary" />
            </CardHeader>
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/[0.06]">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/[0.04]">
              <CardTitle className="text-sm font-semibold">Billing</CardTitle>
              <CreditCard size={14} className="text-primary" />
            </CardHeader>
            <CardContent className="pt-4 text-sm text-muted-foreground">
              <p>{order.billingAddress.street}</p>
              <p>
                {order.billingAddress.city}, {order.billingAddress.state}{" "}
                {order.billingAddress.zipCode}
              </p>
              <p>{order.billingAddress.country}</p>
            </CardContent>
          </Card>
          {order.notes && (
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader className="pb-3 border-b border-white/[0.04]">
                <CardTitle className="text-sm font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                {order.notes}
              </CardContent>
            </Card>
          )}
        </div>
      </motion.section>

      <motion.section
        variants={pageItem}
        className="flex flex-wrap gap-3 justify-end"
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-white/[0.08]"
        >
          <Printer size={14} /> Print
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-white/[0.08]"
        >
          <Send size={14} /> Email
        </Button>
        <Button
          size="sm"
          className="gap-2 gradient-purple text-white hover:opacity-90 rounded-xl border-0"
        >
          <RefreshCw size={14} /> Refund
        </Button>
      </motion.section>
    </PageLayout>
  );
};

export default OrderDetailsPage;
