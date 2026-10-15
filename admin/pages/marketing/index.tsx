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
import {
  Megaphone,
  Tag,
  Plus,
  Copy,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAdminCoupons, useAdminCampaigns } from "@/lib/hooks/useAdminData";
import {
  TableSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/admin/shared/DataStates";
import { toast } from "sonner";
import axios from "axios";
import { getErrorMessage, getResponseInfo } from "@/lib/error";

/** Coupon row as returned by the admin coupons API, before {@link normalizeCoupon} reconciles the aliases. */
type CouponRecord = {
  /** Unique coupon identifier. */
  id?: string | number;
  /** Redeemable coupon code. */
  code?: string;
  /** Discount kind; backend uses `flat` where the UI says `fixed`. */
  type?: "percentage" | "flat" | "fixed" | "freeshipping" | string;
  /** Normalized discount amount or percentage. */
  discount?: number | string;
  /** Raw API discount value, aliased into `discount`. */
  value?: number | string;
  /** Normalized redemption count. */
  usageCount?: number;
  /** Raw API redemption count, aliased into `usageCount`. */
  used_count?: number;
  /** Normalized redemption cap; `0` means unlimited. */
  maxUses?: number;
  /** Raw API redemption cap, aliased into `maxUses`. */
  usage_limit?: number;
  /** Normalized validity start date. */
  startDate?: string;
  /** Normalized validity end date. */
  endDate?: string;
  /** Raw API expiry timestamp, aliased into `endDate`. */
  expires_at?: string;
  /** Raw API creation timestamp, aliased into `startDate`. */
  created_at?: string;
  /** Normalized status: `active`, `expired`, or the raw status. */
  status?: string;
  /** Raw API active flag. */
  active?: boolean;
};

/** Marketing campaign as returned by the admin campaigns API. */
type CampaignItem = {
  /** Unique campaign identifier. */
  id?: string;
  /** Campaign display name. */
  name: string;
  /** Lifecycle status used for badge coloring. */
  status: string;
  /** Estimated audience reach. */
  reach: number | string;
  /** Recorded clicks. */
  clicks?: number | string;
  /** Recorded conversions. */
  conversions: number | string;
  /** Campaign budget. */
  budget?: number | string;
  /** Amount spent so far. */
  spent?: number | string;
  /** Attributed revenue. */
  revenue?: number | string;
  /** Campaign start date. */
  startDate?: string;
  /** Campaign end date, or `null` when open-ended. */
  endDate?: string | null;
};

/**
 * Reconciles the admin coupons API's aliased fields into the flat {@link CouponRecord} shape the table renders.
 *
 * @param raw - Coupon row straight from the API.
 * @returns A coupon with `discount`, `usageCount`, `maxUses`, `startDate`, and `endDate` filled in and `status` derived as `expired` when the expiry is in the past, otherwise `active`/`inactive`.
 */
function normalizeCoupon(raw: CouponRecord): CouponRecord {
  const active =
    typeof raw.active === "boolean"
      ? raw.active
      : raw.status === "active"
        ? true
        : raw.status === "inactive" || raw.status === "expired"
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

/** Tailwind badge classes for each coupon/campaign status. */
const statusColors: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  expired: "bg-red-400/10 text-red-400 border-red-400/20",
  scheduled: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
};

/**
 * Formats an ISO date string for the coupon table.
 *
 * @param raw - Date string from the API; may be omitted.
 * @returns `"-"` when absent, the original string when unparsable, otherwise a locale date string.
 */
const formatDate = (raw?: string) => {
  if (!raw) return "-";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

/**
 * Renders the marketing workspace with coupon KPI stats plus Coupons and Campaigns tabs.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Coupons and campaigns come from {@link useAdminCoupons} and {@link useAdminCampaigns}.
 *
 * @example
 * ```tsx
 * // Route: /marketing — rendered by the Next.js Pages Router.
 * <Marketing />
 * ```
 */
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
  const {
    campaigns,
    isLoading: campaignsLoading,
    error: campaignsError,
  } = useAdminCampaigns();
  const couponRows = useMemo(
    () =>
      (Array.isArray(coupons) ? coupons : []).map((c) =>
        normalizeCoupon(c as CouponRecord),
      ),
    [coupons],
  );
  const activeCoupons = couponRows.filter((c) => c.status === "active").length;
  const totalUsage = couponRows.reduce(
    (sum, c) => sum + (c.usageCount || 0),
    0,
  );

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
    if (
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt.getTime() <= Date.now()
    ) {
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
          <DialogContent className="glass-effect-strong border-border">
            <DialogHeader>
              <DialogTitle className="text-gradient">New Coupon</DialogTitle>
              <DialogDescription>
                Create a new discount coupon code
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm">Coupon Code</Label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  className="bg-background border-border rounded-xl font-mono"
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
                    className="bg-background border-border rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Type</Label>
                  <Select
                    value={newType}
                    onValueChange={(v) =>
                      setNewType(v as "percentage" | "fixed")
                    }
                  >
                    <SelectTrigger className="bg-background border-border rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-effect-strong border-border">
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
                  className="bg-background border-border rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border-border"
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
              <Card className="glass-effect overflow-hidden border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableSkeleton rows={4} cols={6} />
                  </Table>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="glass-effect overflow-hidden border-border">
                <CardContent className="p-4">
                  <ErrorState
                    message={error.message}
                    onRetry={() => mutate()}
                  />
                </CardContent>
              </Card>
            ) : couponRows.length === 0 ? (
              <EmptyState
                title="No coupons found"
                description="Your coupons will appear here."
              />
            ) : (
              <Card className="glass-effect overflow-hidden border-border">
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/60">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                          Code
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                          Discount
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                          Usage
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                          Validity
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {couponRows.map((coupon, i) => {
                        const usage = coupon.usageCount || 0;
                        const maxUses = coupon.maxUses || 0;
                        const width =
                          maxUses > 0
                            ? Math.min(100, (usage / maxUses) * 100)
                            : 0;
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
                            className="border-border/40 hover:bg-accent/40 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono font-semibold bg-muted px-2 py-0.5 rounded">
                                  {coupon.code || "-"}
                                </code>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 hover:bg-accent"
                                  onClick={() => handleCopyCode(coupon.code)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              {discountText}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {usage}/{maxUses || "-"}
                                </span>
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full gradient-purple rounded-full"
                                    style={{ width: `${width}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(coupon.startDate)} -{" "}
                              {formatDate(coupon.endDate)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[coupon.status || ""] || ""
                                }
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
            {campaignsLoading ? (
              <TableSkeleton rows={3} />
            ) : campaignsError ? (
              <ErrorState message="Failed to load campaigns from database." />
            ) : campaigns.length === 0 ? (
              <EmptyState
                title="No campaigns found"
                description="No promotional campaigns found in database."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {(campaigns as CampaignItem[]).map((campaign) => (
                  <Card
                    key={campaign.id || campaign.name}
                    className="glass-effect border-border"
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-tight">
                          {campaign.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={statusColors[campaign.status] || ""}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reach:{" "}
                        <span className="text-foreground">
                          {Number(campaign.reach).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Conversions:{" "}
                        <span className="text-foreground">
                          {Number(campaign.conversions).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Revenue:{" "}
                        <span className="text-emerald-400 font-semibold">
                          £{Number(campaign.revenue).toLocaleString()}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Marketing;

import type { GetServerSidePropsContext } from "next";

/**
 * Server-side admin auth gate for the Marketing route.
 *
 * @param ctx - Next.js server-side context for the incoming request, including `req`/`res` and cookies.
 * @returns The {@link requireAdmin} result: `props` with the authenticated admin user, or a redirect to `/` / `/?error=admin_required` when the session is missing or not an admin.
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
