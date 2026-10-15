import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Check } from "lucide-react";
import type { Plan, StoreSubscription } from "@ecommerce/shared";

/** Props accepted by {@link BillingSettingsTab}. */
export interface BillingSettingsTabProps {
  /** Subscription plans available to the store. */
  plans: Plan[];
  /** Current store subscription, or `null` while none is loaded. */
  subscription: StoreSubscription | null;
  /** Whether subscription details are still loading. */
  billingLoading: boolean;
  /** Called with the chosen plan id when the user switches plans. */
  onUpgradePlan: (planId: string) => Promise<void>;
}

/**
 * Renders the SaaS plan cards with entitlements, the current-plan badge and plan-switch actions.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <BillingSettingsTab
 *   plans={plans}
 *   subscription={subscription}
 *   billingLoading={billingLoading}
 *   onUpgradePlan={handleUpgradePlan}
 * />
 * ```
 */
export const BillingSettingsTab: React.FC<BillingSettingsTabProps> = ({
  plans,
  subscription,
  billingLoading,
  onUpgradePlan,
}) => {
  const currentPlan = plans.find((p) => p.id === subscription?.plan_id);

  return (
    <Card className="glass-effect border-white/[0.06]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" /> Subscription & SaaS
              Tier
            </CardTitle>
            <CardDescription>
              Manage plan quotas, AI query limits, and feature entitlements for
              this store
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-primary/40 text-primary capitalize px-3 py-1"
          >
            Current Plan: {currentPlan?.name || "Free"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {billingLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Loading subscription details...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.id === subscription?.plan_id;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-foreground">
                        {plan.name}
                      </h3>
                      {isCurrent && (
                        <Badge className="bg-primary text-white text-[10px]">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="text-2xl font-black text-foreground">
                        ${plan.price_monthly}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      {plan.slug === "free" &&
                        "Essential tools to start selling and test your storefront."}
                      {plan.slug === "pro" &&
                        "High-volume commerce with copilot agent and custom domains."}
                      {plan.slug === "business" &&
                        "Full enterprise autonomy with limitless scale and priority queues."}
                    </p>

                    <Separator className="bg-white/[0.06] mb-4" />

                    <ul className="space-y-2.5 text-xs">
                      {plan.entitlements?.map((e) => (
                        <li
                          key={e.feature_key}
                          className="flex items-center gap-2 text-foreground/80"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {e.feature_key === "max_products" &&
                              `${e.quota_limit ?? e.limit_value ?? 100} Products`}
                            {e.feature_key === "ai_queries_monthly" &&
                              `${e.quota_limit ?? e.limit_value ?? 50} AI Copilot Queries/mo`}
                            {e.feature_key === "custom_domain" &&
                              "Custom Domain Support"}
                            {e.feature_key === "priority_support" &&
                              "Priority 24/7 SLA"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant={isCurrent ? "outline" : "default"}
                      size="sm"
                      disabled={isCurrent}
                      onClick={() => onUpgradePlan(plan.id)}
                      className={`w-full text-xs font-semibold rounded-xl ${
                        !isCurrent ? "gradient-purple text-white" : ""
                      }`}
                    >
                      {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
