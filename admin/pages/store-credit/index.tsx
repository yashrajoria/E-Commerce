import { useState, useMemo } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  useStoreCreditBalance,
  useStoreCreditLedger,
  useStoreCreditReconcile,
  grantStoreCredit,
  adjustStoreCredit,
} from "@/hooks/useStoreCredit";
import { useStore } from "@/lib/useStore";
import { useAdminSession } from "@/lib/useAdminSession";
import { useAdminCustomers } from "@/lib/hooks/useAdminData";
import { toast } from "sonner";
import {
  Coins,
  ShieldAlert,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Search,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  Users,
} from "lucide-react";
import type { StoreCreditLedgerEntry } from "@/types/storeCredit";

/**
 * Formats a store-credit amount held in minor units as a localized currency string.
 *
 * @param minorAmount - Amount in minor units (pence/cents).
 * @param currency - ISO currency code; defaults to `"GBP"`.
 * @returns The formatted currency string, e.g. `"£12.50"`, falling back to `"<CODE> 12.50"` if `Intl` rejects the currency code.
 */
function formatCurrencyAmount(minorAmount: number, currency = "GBP"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(minorAmount / 100);
  } catch {
    return `${currency} ${(minorAmount / 100).toFixed(2)}`;
  }
}

/**
 * Maps a store-credit ledger entry type to its badge label and Tailwind classes.
 *
 * @param entryType - Ledger entry type such as `grant`, `refund`, `debit`, `hold`, `capture`, or `release`.
 * @returns The badge `{ label, className }` for the type, falling back to a muted badge showing the raw type.
 */
function getEntryBadge(entryType: string): {
  label: string;
  className: string;
} {
  switch (entryType) {
    case "grant":
      return {
        label: "Grant",
        className:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "refund":
      return {
        label: "Refund",
        className:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "debit":
      return {
        label: "Debit",
        className:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "hold":
      return {
        label: "Hold",
        className:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "capture":
      return {
        label: "Capture",
        className:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "release":
      return {
        label: "Release",
        className:
          "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
      };
    default:
      return {
        label: entryType,
        className: "bg-muted text-muted-foreground border-border",
      };
  }
}

/**
 * Renders the store-credit console: customer picker, balances, grant/debit/reconcile actions, and ledger.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Balance, ledger, and reconciliation come from {@link useStoreCreditBalance}, {@link useStoreCreditLedger}, and {@link useStoreCreditReconcile}; mutations go through {@link grantStoreCredit} and {@link adjustStoreCredit}. `admin`/`owner` roles can mutate while `manager` is read-only.
 *
 * @example
 * ```tsx
 * // Route: /store-credit — rendered by the Next.js Pages Router.
 * <StoreCreditPage />
 * ```
 */
export default function StoreCreditPage() {
  const { activeStore } = useStore();
  const { user } = useAdminSession();
  const storeId =
    activeStore?.id || process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "";
  const storeCurrency = activeStore?.currency || "GBP";

  // Permission check: Global Admin or Store Owner / Store Admin can mutate.
  // Store Manager is read-only.
  const userRole = (user?.role || "").toLowerCase();
  const isManager = userRole === "manager";
  const canMutate = userRole === "admin" || userRole === "owner";

  // Customer search & selection
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const { customers } = useAdminCustomers({
    pageSize: 5,
    search: customerSearch,
  });

  // Data fetching
  const {
    data: balance,
    isLoading: isBalanceLoading,
    mutate: mutateBalance,
  } = useStoreCreditBalance(selectedUserId, storeId);

  const {
    data: ledgerData,
    isLoading: isLedgerLoading,
    mutate: mutateLedger,
  } = useStoreCreditLedger(selectedUserId, storeId);

  // Modals state
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);

  // Form states
  const [grantAmountMajor, setGrantAmountMajor] = useState("");
  const [grantReason, setGrantReason] = useState("");
  const [adjustAmountMajor, setAdjustAmountMajor] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustIsDebit, setAdjustIsDebit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reconcile query
  const {
    data: reconcileReport,
    isLoading: isReconcileLoading,
    mutate: refetchReconcile,
  } = useStoreCreditReconcile(
    reconcileModalOpen ? selectedUserId : undefined,
    storeId,
  );

  const handleRefresh = async () => {
    await Promise.all([mutateBalance(), mutateLedger()]);
    toast.success("Store credit data refreshed");
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !storeId) {
      toast.error("Please select a customer and store");
      return;
    }
    const major = parseFloat(grantAmountMajor);
    if (isNaN(major) || major <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!grantReason.trim()) {
      toast.error("Reason is required for audit ledger");
      return;
    }

    const minorUnits = Math.round(major * 100);
    setIsSubmitting(true);
    try {
      await grantStoreCredit(
        selectedUserId,
        minorUnits,
        storeCurrency,
        grantReason.trim(),
        storeId,
      );
      toast.success(
        `Successfully granted ${formatCurrencyAmount(minorUnits, storeCurrency)} to customer`,
      );
      setGrantModalOpen(false);
      setGrantAmountMajor("");
      setGrantReason("");
      await Promise.all([mutateBalance(), mutateLedger()]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to issue store credit grant";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !storeId) {
      toast.error("Please select a customer and store");
      return;
    }
    const major = parseFloat(adjustAmountMajor);
    if (isNaN(major) || major <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!adjustReason.trim()) {
      toast.error("Reason is required for audit ledger");
      return;
    }

    const minorUnits = Math.round(major * 100) * (adjustIsDebit ? -1 : 1);
    setIsSubmitting(true);
    try {
      await adjustStoreCredit(
        selectedUserId,
        minorUnits,
        storeCurrency,
        adjustReason.trim(),
        storeId,
      );
      toast.success(
        `Successfully ${adjustIsDebit ? "debited" : "credited"} ${formatCurrencyAmount(
          Math.abs(minorUnits),
          storeCurrency,
        )}`,
      );
      setAdjustModalOpen(false);
      setAdjustAmountMajor("");
      setAdjustReason("");
      await Promise.all([mutateBalance(), mutateLedger()]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to adjust store credit";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const entries: StoreCreditLedgerEntry[] = useMemo(() => {
    return ledgerData?.entries || [];
  }, [ledgerData]);

  return (
    <PageLayout
      title="Store Credit Management"
      breadcrumbs={[{ label: "Finance" }, { label: "Store Credit" }]}
    >
      <div className="space-y-6">
        {/* Store & Role Context Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  Store: {activeStore?.name || "Default Store"}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {storeId
                    ? `ID: ${storeId.slice(0, 8)}…`
                    : "No Store Selected"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Balances and ledgers are strictly store-scoped. Double-entry
                immutable accounting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isManager && (
              <Badge
                variant="secondary"
                className="gap-1.5 py-1 px-2.5 text-xs"
              >
                <Lock className="h-3 w-3 text-muted-foreground" />
                Manager: Read-Only Audit Access
              </Badge>
            )}
            {canMutate && (
              <Badge
                variant="outline"
                className="gap-1.5 py-1 px-2.5 text-xs text-emerald-600 border-emerald-500/20 bg-emerald-500/10"
              >
                <ShieldCheck className="h-3 w-3" />
                Mutator Authorized ({userRole})
              </Badge>
            )}
          </div>
        </div>

        {/* Customer Search & Picker */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Select Customer Account
            </CardTitle>
            <CardDescription className="text-xs">
              Search by customer name, email, or enter a customer user ID
              directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter user UUID or search name/email..."
                  className="pl-9 text-xs"
                  value={customerSearch || selectedUserId}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setSelectedUserId(e.target.value);
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={!selectedUserId}
                className="gap-2 text-xs shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>

            {/* Quick customer pick suggestions */}
            {customers && customers.length > 0 && customerSearch && (
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-muted-foreground self-center">
                  Matches:
                </span>
                {customers.map(
                  (c: { id?: string; email?: string; name?: string }) => (
                    <Button
                      key={c.id || c.email}
                      variant={selectedUserId === c.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7 gap-1.5"
                      onClick={() => {
                        if (c.id) setSelectedUserId(c.id);
                        if (c.email) setCustomerSearch(c.email);
                      }}
                    >
                      <span>{c.name || c.email}</span>
                      <span className="text-[10px] opacity-70">
                        ({c.id?.slice(0, 6)}…)
                      </span>
                    </Button>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedUserId ? (
          <>
            {/* Balance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Available Balance
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                    {isBalanceLoading
                      ? "…"
                      : formatCurrencyAmount(
                          balance?.available_amount ?? 0,
                          balance?.currency || storeCurrency,
                        )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active for checkout
                    redemption
                  </span>
                </CardContent>
              </Card>

              <Card
                className={
                  balance && balance.held_amount > 0
                    ? "border-amber-500/30 bg-amber-500/5"
                    : ""
                }
              >
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Held Amount
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                    {isBalanceLoading
                      ? "…"
                      : formatCurrencyAmount(
                          balance?.held_amount ?? 0,
                          balance?.currency || storeCurrency,
                        )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    Reserved during ongoing order checkout
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-medium">
                    Total Account Value
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold tracking-tight text-muted-foreground">
                    {isBalanceLoading
                      ? "…"
                      : formatCurrencyAmount(
                          balance?.total_amount ?? 0,
                          balance?.currency || storeCurrency,
                        )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    Available + Held balance
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">
                  Account Operations:
                </span>
                {isManager && (
                  <span className="text-xs text-muted-foreground italic">
                    (Mutation operations restricted for Store Managers)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => setReconcileModalOpen(true)}
                >
                  <Scale className="h-3.5 w-3.5 text-blue-500" />
                  Audit Reconcile
                </Button>

                {canMutate ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs text-rose-600 hover:text-rose-700"
                      onClick={() => {
                        setAdjustIsDebit(true);
                        setAdjustModalOpen(true);
                      }}
                    >
                      <MinusCircle className="h-3.5 w-3.5" />
                      Debit / Correction
                    </Button>

                    <Button
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => setGrantModalOpen(true)}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Issue Grant
                    </Button>
                  </>
                ) : (
                  <Button size="sm" disabled className="gap-1.5 text-xs">
                    <Lock className="h-3.5 w-3.5" />
                    Mutations Disabled (Manager)
                  </Button>
                )}
              </div>
            </div>

            {/* Immutable Ledger Table */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Immutable Ledger History
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Single source of truth. Every transaction records deltas
                      with nonces and reason.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {entries.length}{" "}
                    {entries.length === 1 ? "entry" : "entries"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLedgerLoading ? (
                  <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                    Loading ledger entries…
                  </div>
                ) : entries.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No transactions recorded for this customer yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Date & Time</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Amount</TableHead>
                        <TableHead className="text-xs">
                          Available Delta
                        </TableHead>
                        <TableHead className="text-xs">Held Delta</TableHead>
                        <TableHead className="text-xs">Reason</TableHead>
                        <TableHead className="text-xs">
                          Idempotency Key
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => {
                        const badge = getEntryBadge(entry.entry_type);
                        const isAvailPos = entry.available_delta > 0;
                        const isAvailNeg = entry.available_delta < 0;
                        const dateFormatted = new Date(
                          entry.created_at,
                        ).toLocaleString();

                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {dateFormatted}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${badge.className}`}
                              >
                                {badge.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-foreground">
                              {formatCurrencyAmount(
                                entry.amount,
                                entry.currency || storeCurrency,
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              <span
                                className={`font-medium ${
                                  isAvailPos
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : isAvailNeg
                                      ? "text-rose-600 dark:text-rose-400"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {isAvailPos ? "+" : ""}
                                {formatCurrencyAmount(
                                  entry.available_delta,
                                  entry.currency || storeCurrency,
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">
                              {entry.held_delta !== 0 ? (
                                <span
                                  className={
                                    entry.held_delta > 0
                                      ? "text-amber-600"
                                      : "text-blue-600"
                                  }
                                >
                                  {entry.held_delta > 0 ? "+" : ""}
                                  {formatCurrencyAmount(
                                    entry.held_delta,
                                    entry.currency || storeCurrency,
                                  )}
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-foreground max-w-xs truncate">
                              {entry.reason || "—"}
                            </TableCell>
                            <TableCell className="text-[11px] font-mono text-muted-foreground max-w-xs truncate">
                              {entry.idempotency_key || "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center space-y-2">
            <Coins className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">
              No Customer Selected
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Please enter a customer user ID or pick a customer account from
              the search box above to inspect balances and ledger records.
            </p>
          </div>
        )}
      </div>

      {/* Grant Modal */}
      <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-500" />
              Issue Store Credit Grant
            </DialogTitle>
            <DialogDescription className="text-xs">
              Credits will be added immediately to the customer account and
              recorded as a grant entry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGrantSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Customer ID</Label>
              <Input
                disabled
                value={selectedUserId}
                className="font-mono text-xs bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="grant-amount" className="text-xs">
                Amount ({storeCurrency})
              </Label>
              <Input
                id="grant-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="10.00"
                value={grantAmountMajor}
                onChange={(e) => setGrantAmountMajor(e.target.value)}
                required
              />
              {grantAmountMajor && !isNaN(parseFloat(grantAmountMajor)) && (
                <p className="text-[11px] text-muted-foreground">
                  Minor units to store:{" "}
                  {Math.round(parseFloat(grantAmountMajor) * 100)} cents/pence
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="grant-reason" className="text-xs">
                Reason for Grant
              </Label>
              <Input
                id="grant-reason"
                placeholder="e.g. Goodwill gesture, loyalty bonus, promotion"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGrantModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Issuing Grant…" : "Confirm Grant"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Adjust / Debit Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {adjustIsDebit ? (
                <MinusCircle className="h-5 w-5 text-rose-500" />
              ) : (
                <PlusCircle className="h-5 w-5 text-emerald-500" />
              )}
              {adjustIsDebit
                ? "Debit / Balance Correction"
                : "Credit Adjustment"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Direct balance mutation with audit trail. Use with care.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdjustSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Customer ID</Label>
              <Input
                disabled
                value={selectedUserId}
                className="font-mono text-xs bg-muted"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adjust-amount" className="text-xs">
                Amount ({storeCurrency})
              </Label>
              <Input
                id="adjust-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="5.00"
                value={adjustAmountMajor}
                onChange={(e) => setAdjustAmountMajor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adjust-reason" className="text-xs">
                Reason for Adjustment
              </Label>
              <Input
                id="adjust-reason"
                placeholder="e.g. Correct accidental grant, manual reconciliation"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant={adjustIsDebit ? "destructive" : "default"}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Applying…"
                  : adjustIsDebit
                    ? "Confirm Debit"
                    : "Confirm Adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Audit Reconciliation Modal */}
      <Dialog open={reconcileModalOpen} onOpenChange={setReconcileModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" />
              Ledger Reconciliation Audit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Cross-checks the cached account balance against the cumulative sum
              of all immutable ledger entries.
            </DialogDescription>
          </DialogHeader>

          {isReconcileLoading ? (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
              Running audit reconciliation check…
            </div>
          ) : reconcileReport ? (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account ID:</span>
                  <span className="font-mono text-foreground">
                    {reconcileReport.account_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total Ledger Entries:
                  </span>
                  <span className="font-bold text-foreground">
                    {reconcileReport.total_ledger_entries}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">
                    Available Balance
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span>Cached:</span>
                    <span className="font-bold">
                      {formatCurrencyAmount(
                        reconcileReport.cached_available,
                        reconcileReport.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ledger Sum:</span>
                    <span className="font-bold">
                      {formatCurrencyAmount(
                        reconcileReport.ledger_available,
                        reconcileReport.currency,
                      )}
                    </span>
                  </div>
                  <div className="pt-2">
                    {reconcileReport.available_matched ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      >
                        ✓ Available Matched
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Mismatch Detected
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border space-y-1">
                  <span className="text-muted-foreground font-medium">
                    Held Balance
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span>Cached:</span>
                    <span className="font-bold">
                      {formatCurrencyAmount(
                        reconcileReport.cached_held,
                        reconcileReport.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ledger Sum:</span>
                    <span className="font-bold">
                      {formatCurrencyAmount(
                        reconcileReport.ledger_held,
                        reconcileReport.currency,
                      )}
                    </span>
                  </div>
                  <div className="pt-2">
                    {reconcileReport.held_matched ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      >
                        ✓ Held Matched
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Mismatch Detected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {reconcileReport.available_matched &&
              reconcileReport.held_matched ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Ledger integrity verified: The cached balance is 100%
                    consistent with the immutable ledger.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>
                    Integrity anomaly: Cached balance does not match the ledger
                    sum.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Unable to run reconciliation. Please ensure a valid customer is
              selected.
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchReconcile()}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3 w-3" /> Re-audit
            </Button>
            <Button size="sm" onClick={() => setReconcileModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
