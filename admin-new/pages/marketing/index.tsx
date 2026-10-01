/**
 * Premium Marketing / Promotions Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Megaphone, Tag, Plus, Copy, DollarSign, Users, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdminCoupons } from "@/lib/hooks/useAdminData";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/admin/shared/DataStates";
import { toast } from "sonner";
import axios from "axios";
import { getErrorMessage, getResponseInfo } from "@/lib/error";

type CouponRecord = {
  id?: string | number;
  code?: string;
  type?: "percentage" | "flat" | "fixed" | "freeshipping" | string;
  discount?: number | string;
  value?: number | string;
  usageCount?: number;
  used_count?: number;
  maxUses?: number;
  usage_limit?: number;
  startDate?: string;
  endDate?: string;
  expires_at?: string;
  created_at?: string;
  status?: string;
  active?: boolean;
};

function normalizeCoupon(raw: CouponRecord): CouponRecord {
  const active =
    typeof raw.active === "boolean"
      ? raw.active
      : raw.status === "active"
        ? true
        : raw.status === "expired"
          ? false
          : Boolean(raw.active ?? raw.status);
  const expiresAt = raw.expires_at || raw.endDate;
  const expired =
    expiresAt && !Number.isNaN(new Date(expiresAt).getTime())
      ? new Date(expiresAt).getTime() < Date.now()
      : false;

  return {
    ...raw,
    discount: raw.discount ?? raw.value ?? 0,
    usageCount: raw.usageCount ?? raw.used_count ?? 0,
    maxUses: raw.maxUses ?? raw.usage_limit ?? 0,
    startDate: raw.startDate ?? raw.created_at,
    endDate: raw.endDate ?? raw.expires_at,
    status: expired ? "expired" : active ? "active" : raw.status || "inactive",
  };
}

const campaigns = [
  { name: "Winter Sale 2024", status: "active", reach: 12500, conversions: 340, revenue: 8500 },
  { name: "New Year Flash Sale", status: "scheduled", reach: 0, conversions: 0, revenue: 0 },
  { name: "Valentine's Day Special", status: "completed", reach: 8900, conversions: 210, revenue: 5200 },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  expired: "bg-red-400/10 text-red-400 border-red-400/20",
  scheduled: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
};

const formatDate = (raw?: string) => {
  if (!raw) return "-";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

const Marketing = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newExpiresAt, setNewExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  const { coupons, error, isLoading, mutate } = useAdminCoupons();
  const couponRows = useMemo(
    () =>
      (Array.isArray(coupons) ? coupons : []).map((c) =>
        normalizeCoupon(c as CouponRecord),
      ),
    [coupons],
  );
  const activeCoupons = couponRows.filter((c) => c.status === "active").length;
  const totalUsage = couponRows.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  const handleCreateCoupon = async () => {
    const code = newCode.trim().toUpperCase();
    const value = Number(newDiscount);

    if (code.length < 3) {
      toast.error("Coupon code must be at least 3 characters");
      return;
    }
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    if (newType === "percentage" && value > 100) {
      toast.error("Percentage discount cannot exceed 100");
      return;
    }
    if (!newExpiresAt) {
      toast.error("Expiry date is required");
      return;
    }

    const expiresAt = new Date(`${newExpiresAt}T23:59:59.000Z`);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      toast.error("Expiry date must be in the future");
      return;
    }

    setCreating(true);
    try {
      await axios.post(
        "/bff/admin/coupons",
        {
          code,
          // Backend expects "flat", UI label is "fixed".
          type: newType === "fixed" ? "flat" : "percentage",
          value,
          min_order_value: 0,
          usage_limit: 0,
          expires_at: expiresAt.toISOString(),
        },
        { withCredentials: true },
      );
      toast.success(`Coupon "${code}" created successfully`);
      setIsCreateOpen(false);
      setNewCode("");
      setNewDiscount("");
      setNewType("percentage");
      await mutate();
    } catch (err: unknown) {
      const { data } = getResponseInfo(err);
      const apiMessage =
        data &&
        typeof data === "object" &&
        "error" in (data as Record<string, unknown>)
          ? String((data as { error?: unknown }).error)
          : data &&
              typeof data === "object" &&
              "message" in (data as Record<string, unknown>)
            ? String((data as { message?: unknown }).message)
            : getErrorMessage(err);
      toast.error(apiMessage || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard`);
  };

  return (
    <PageLayout
      title="Marketing"
      breadcrumbs={[{ label: "Marketing" }]}
      headerActions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
            >
              <Plus size={13} />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect-strong border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="text-gradient">New Coupon</DialogTitle>
              <DialogDescription>Create a new discount coupon code</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm">Coupon Code</Label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Discount</Label>
                  <Input
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    type="number"
                    placeholder="0"
                    className="bg-white/[0.04] border-white/[0.08] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Select value={newType} onValueChange={(v) => setNewType(v as "percentage" | "fixed")}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-effect-strong border-white/[0.08]">
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Expires on</Label>
                <Input
                  type="date"
                  value={newExpiresAt}
                  onChange={(e) => setNewExpiresAt(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border-white/[0.08]"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleCreateCoupon()}
                disabled={creating}
                className="gradient-purple text-white border-0 rounded-xl"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Active Coupons"
          value={activeCoupons}
          icon={Tag}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="Total Usage"
          value={totalUsage}
          icon={Users}
          trend={{ value: 18.3, label: "this month" }}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Revenue Impact"
          value="£13,700"
          icon={DollarSign}
          gradient="gradient-gold"
          glowClass="glow-gold"
        />
        <StatsCard
          title="Campaigns"
          value={campaigns.length}
          icon={Megaphone}
          gradient="gradient-blue"
        />
      </motion.section>

      <motion.section variants={pageItem}>
        <Tabs defaultValue="coupons" className="space-y-6">
          <div className="glass-effect rounded-xl p-1.5 inline-flex">
            <TabsList className="bg-transparent gap-1 h-auto p-0">
              <TabsTrigger
                value="coupons"
                className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs gap-2 transition-all"
              >
                <Tag size={13} />
                Coupons
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs gap-2 transition-all"
              >
                <Megaphone size={13} />
                Campaigns
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="coupons" className="mt-6">
            {isLoading ? (
              <Card className="glass-effect overflow-hidden border-white/[0.06]">
                <CardContent className="p-0">
                  <Table>
                    <TableSkeleton rows={4} cols={6} />
                  </Table>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="glass-effect overflow-hidden border-white/[0.06]">
                <CardContent className="p-4">
                  <ErrorState message={error.message} onRetry={() => mutate()} />
                </CardContent>
              </Card>
            ) : couponRows.length === 0 ? (
              <EmptyState
                title="No coupons found"
                description="Your coupons will appear here."
              />
            ) : (
              <Card className="glass-effect overflow-hidden border-white/[0.06]">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.04]">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Code</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Discount</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Usage</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Validity</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {couponRows.map((coupon, i) => {
                        const usage = coupon.usageCount || 0;
                        const maxUses = coupon.maxUses || 0;
                        const width = maxUses > 0 ? Math.min(100, (usage / maxUses) * 100) : 0;
                        const couponKey = String(coupon.id ?? coupon.code ?? i);
                        const discountText =
                          coupon.type === "percentage"
                            ? `${coupon.discount || 0}%`
                            : coupon.type === "freeshipping"
                              ? "Free shipping"
                              : `£${coupon.discount || 0}`;

                        return (
                          <TableRow
                            key={couponKey}
                            className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-semibold bg-white/[0.04] px-2 py-0.5 rounded">
                                  {coupon.code || "-"}
                                </code>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 hover:bg-white/[0.06]"
                                  onClick={() => handleCopyCode(coupon.code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">{discountText}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{usage}/{maxUses || "-"}</span>
                                <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                  <div className="h-full gradient-purple rounded-full" style={{ width: `${width}%` }} />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={statusColors[coupon.status || ""] || ""}
                              >
                                {coupon.status || "unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Switch checked={coupon.status === "active"} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.name} className="glass-effect border-white/[0.06]">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold leading-tight">{campaign.name}</h3>
                      <Badge variant="outline" className={statusColors[campaign.status]}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reach: <span className="text-foreground">{campaign.reach.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Conversions: <span className="text-foreground">{campaign.conversions.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Revenue: <span className="text-emerald-400 font-semibold">£{campaign.revenue.toLocaleString()}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Marketing;


import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
