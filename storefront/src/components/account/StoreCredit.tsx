import { useEffect, useState, useCallback } from "react";
import {
  axiosInstance,
  getActiveStoreId,
  StoreCreditBalance,
  StoreCreditLedgerEntry,
} from "@ecommerce/shared";
import { API_ROUTES } from "@/pages/api/constants/apiRoutes";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

function getBadgeVariant(entryType: string): {
  label: string;
  className: string;
} {
  switch (entryType) {
    case "grant":
      return {
        label: "Credit Added",
        className:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "refund":
      return {
        label: "Refunded",
        className:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "debit":
      return {
        label: "Adjustment",
        className:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "hold":
      return {
        label: "Held in Checkout",
        className:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "capture":
      return {
        label: "Redeemed",
        className:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "release":
      return {
        label: "Released",
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
 * Fetches and renders the customer's store-credit balance and ledger activity.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <TabsContent value="credit">
 *   <StoreCredit />
 * </TabsContent>
 * ```
 */
export function StoreCredit() {
  const [balance, setBalance] = useState<StoreCreditBalance | null>(null);
  const [entries, setEntries] = useState<StoreCreditLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditData = useCallback(async () => {
    const storeId = getActiveStoreId();
    if (!storeId) {
      setError("Please select a store to view your store credit balance.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = { "X-Store-ID": storeId };
      const [balanceRes, ledgerRes] = await Promise.all([
        axiosInstance.get<StoreCreditBalance>(API_ROUTES.STORE_CREDIT.BALANCE, {
          headers,
        }),
        axiosInstance.get<{ entries: StoreCreditLedgerEntry[] }>(
          API_ROUTES.STORE_CREDIT.LEDGER,
          { headers },
        ),
      ]);

      setBalance(balanceRes.data);
      setEntries(ledgerRes.data?.entries || []);
    } catch (err: unknown) {
      console.error("Failed to load store credit:", err);
      setError("Unable to load store credit information at this time.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreditData();
  }, [fetchCreditData]);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-20 w-full bg-muted rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCreditData}
          className="gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  const currency = balance?.currency || "GBP";
  const availableAmount = balance?.available_amount ?? 0;
  const heldAmount = balance?.held_amount ?? 0;
  const totalAmount = balance?.total_amount ?? 0;

  return (
    <section className="rounded-lg border border-border bg-surface p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-foreground">
              Store Credit
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Store credit is stored as an immutable ledger and automatically
            available to apply during checkout.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchCreditData}
          className="self-start sm:self-auto gap-1 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Balance overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border/80 bg-background/50 p-4 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Available to Spend
          </span>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {formatCurrencyAmount(availableAmount, currency)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Ready for checkout
          </span>
        </div>

        {heldAmount > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Held in Checkout
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrencyAmount(heldAmount, currency)}
            </div>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Released if order expires
            </span>
          </div>
        )}

        <div className="rounded-lg border border-border/80 bg-background/50 p-4 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Total Account Value
          </span>
          <div className="text-2xl font-bold tracking-tight text-muted-foreground">
            {formatCurrencyAmount(totalAmount, currency)}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Available + held funds
          </span>
        </div>
      </div>

      {/* Ledger history */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Ledger Activity
          </h3>
          <span className="text-xs text-muted-foreground">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-xs text-muted-foreground">
              No store credit transactions recorded yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border bg-background/40">
            {entries.map((entry) => {
              const badge = getBadgeVariant(entry.entry_type);
              const delta = entry.available_delta;
              const isPositive = delta > 0;
              const formattedDate = new Date(
                entry.created_at,
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={entry.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full p-1.5 bg-muted">
                      {isPositive ? (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 ${badge.className}`}
                        >
                          {badge.label}
                        </Badge>
                        <span className="text-muted-foreground">
                          {formattedDate}
                        </span>
                      </div>
                      <p className="text-foreground font-medium mt-1">
                        {entry.reason || "Store credit transaction"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right pl-9 sm:pl-0">
                    <span
                      className={`text-sm font-semibold ${
                        isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : delta < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrencyAmount(
                        delta !== 0 ? delta : entry.amount,
                        entry.currency || currency,
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
