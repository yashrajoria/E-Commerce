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
import { Megaphone, Tag, Plus, Copy, DollarSign, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  type: "percentage" | "fixed";
  usageCount: number;
  maxUses: number;
  status: "active" | "expired" | "scheduled";
  startDate: string;
  endDate: string;
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    discount: "20",
    type: "percentage",
    usageCount: 245,
    maxUses: 500,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: "2",
    code: "FLAT50",
    discount: "50",
    type: "fixed",
    usageCount: 89,
    maxUses: 200,
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
  },
  {
    id: "3",
    code: "SUMMER15",
    discount: "15",
    type: "percentage",
    usageCount: 500,
    maxUses: 500,
    status: "expired",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: "4",
    code: "HOLIDAY25",
    discount: "25",
    type: "percentage",
    usageCount: 0,
    maxUses: 1000,
    status: "scheduled",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
  },
];

const campaigns = [
  {
    name: "Winter Sale 2024",
    status: "active",
    reach: 12500,
    conversions: 340,
    revenue: 8500,
  },
  {
    name: "New Year Flash Sale",
    status: "scheduled",
    reach: 0,
    conversions: 0,
    revenue: 0,
  },
  {
    name: "Valentine's Day Special",
    status: "completed",
    reach: 8900,
    conversions: 210,
    revenue: 5200,
  },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  expired: "bg-red-400/10 text-red-400 border-red-400/20",
  scheduled: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
};

const Marketing = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");

  const handleCreateCoupon = () => {
    if (!newCode || !newDiscount) return;
    toast.success(`Coupon "${newCode}" created successfully!`);
    setIsCreateOpen(false);
    setNewCode("");
    setNewDiscount("");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard`);
  };

  const activeCoupons = mockCoupons.filter((c) => c.status === "active").length;
  const totalUsage = mockCoupons.reduce((sum, c) => sum + c.usageCount, 0);

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
                  <Select
                    value={newType}
                    onValueChange={(v) =>
                      setNewType(v as "percentage" | "fixed")
                    }
                  >
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-effect-strong border-white/[0.08]">
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border-white/[0.08]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCoupon}
                className="gradient-purple text-white border-0 rounded-xl"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* KPI Stats */}
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
          value="$13,700"
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

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="mt-6">
            <Card className="glass-effect overflow-hidden border-white/[0.06]">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.04]">
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
                    {mockCoupons.map((coupon, i) => (
                      <motion.tr
                        key={coupon.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-semibold bg-white/[0.04] px-2 py-0.5 rounded">
                              {coupon.code}
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
                        <TableCell className="font-semibold text-sm">
                          {coupon.type === "percentage"
                            ? `${coupon.discount}%`
                            : `$${coupon.discount}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {coupon.usageCount}/{coupon.maxUses}
                            </span>
                            <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-purple rounded-full"
                                style={{
                                  width: `${(coupon.usageCount / coupon.maxUses) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {coupon.startDate} — {coupon.endDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[coupon.status]}
                          >
                            {coupon.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Switch defaultChecked={coupon.status === "active"} />
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4 mt-6">
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="glass-effect border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl gradient-purple flex items-center justify-center shrink-0">
                          <Megaphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {campaign.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`mt-1 text-[10px] ${statusColors[campaign.status]}`}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-0.5">Reach</p>
                          <p className="font-semibold">
                            {campaign.reach.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground mb-0.5">
                            Conversions
                          </p>
                          <p className="font-semibold">
                            {campaign.conversions.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground mb-0.5">
                            Revenue
                          </p>
                          <p className="font-semibold text-emerald-400">
                            ${campaign.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Marketing;
