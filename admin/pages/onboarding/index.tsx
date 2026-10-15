/**
 * Multi-Tenant Store Onboarding Wizard
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Store,
  Zap,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import { useStore } from "@/lib/useStore";
import type { Plan } from "@ecommerce/shared";

/**
 * Renders the multi-tenant store onboarding wizard: store identity, plan selection, theme color, and a confirmation step.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Plans are fetched from `/api/bff/admin/plans` and the store is created through {@link useStore}'s `createStore`.
 *
 * @example
 * ```tsx
 * // Route: /onboarding — rendered by the Next.js Pages Router.
 * <OnboardingPage />
 * ```
 */
const OnboardingPage = () => {
  const router = useRouter();
  const { createStore, refreshStores } = useStore();

  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available plans
    axios
      .get("/api/bff/admin/plans", { withCredentials: true })
      .then((res) => {
        const fetchedPlans: Plan[] = res.data?.plans || [];
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          const freePlan =
            fetchedPlans.find((p) => p.slug === "free") || fetchedPlans[0];
          setSelectedPlanId(freePlan.id);
        }
      })
      .catch((err) => console.error("Failed to load plans:", err));
  }, []);

  const handleStep1Next = () => {
    if (!storeName.trim()) {
      toast.error("Please enter a store name");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Create the store
      const store = await createStore(
        storeName.trim(),
        storeSlug.trim() || undefined,
        currency,
      );
      if (!store) {
        setLoading(false);
        return;
      }

      // 2. If non-default plan selected, subscribe store to plan
      if (selectedPlanId) {
        await axios.post(
          `/api/bff/admin/stores/${store.id}/subscription`,
          { plan_id: selectedPlanId },
          { withCredentials: true },
        );
      }

      // 3. Save initial theme settings
      await axios.put(
        `/api/bff/admin/stores/${store.id}/settings`,
        {
          theme_config: {
            primary_color: primaryColor,
            dark_mode: true,
          },
        },
        { withCredentials: true },
      );

      toast.success(`Welcome to ShopSwift! Store "${store.name}" is ready.`);
      await refreshStores();
      setStep(4);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(
        errorObj.response?.data?.message || "Failed to complete onboarding",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Store Setup Wizard"
      breadcrumbs={[{ label: "Onboarding" }]}
      maxWidth="max-w-3xl"
    >
      <motion.div variants={pageItem} className="space-y-6">
        {/* Progress header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Launch Your Store
              </h2>
              <p className="text-xs text-muted-foreground">
                Step {step} of 3 — Instant SaaS Setup
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? "w-8 bg-primary"
                    : step > s
                      ? "w-4 bg-emerald-400"
                      : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass-effect border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Store className="h-4 w-4 text-purple-400" /> Store Identity
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Choose a display name and unique storefront URL for your
                    business.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Store Name *
                    </Label>
                    <Input
                      placeholder="e.g. Nexus Apparel"
                      value={storeName}
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        if (
                          !storeSlug ||
                          storeSlug ===
                            storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        ) {
                          setStoreSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-"),
                          );
                        }
                      }}
                      className="h-10 text-xs bg-background border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      URL Identifier (Slug)
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        shopswift.app/
                      </span>
                      <Input
                        placeholder="nexus-apparel"
                        value={storeSlug}
                        onChange={(e) =>
                          setStoreSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ""),
                          )
                        }
                        className="h-10 text-xs font-mono bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Base Currency
                    </Label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleStep1Next}
                  className="gradient-purple text-white gap-2 text-xs h-10 px-6 rounded-xl"
                >
                  Next: Choose Plan <ArrowRight size={14} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass-effect border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" /> Select
                    Subscription Plan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Choose the plan that fits your current operational needs.
                    You can upgrade anytime.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">
                                {plan.name}
                              </span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              )}
                            </div>
                            <div className="text-lg font-black text-foreground mb-2">
                              ${plan.price_monthly}
                              <span className="text-[10px] text-muted-foreground font-normal">
                                {" "}
                                /mo
                              </span>
                            </div>
                            <ul className="space-y-1 text-[11px] text-muted-foreground">
                              {plan.entitlements?.slice(0, 3).map((e) => (
                                <li
                                  key={e.feature_key}
                                  className="flex items-center gap-1.5"
                                >
                                  <span className="text-emerald-400">✓</span>
                                  <span>
                                    {(e.quota_limit ?? e.limit_value ?? 0) > 0
                                      ? `${e.quota_limit ?? e.limit_value} `
                                      : ""}
                                    {e.feature_key.replace(/_/g, " ")}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="gap-2 text-xs h-10 px-5 rounded-xl border-border hover:bg-accent"
                >
                  <ArrowLeft size={14} /> Back
                </Button>
                <Button
                  onClick={handleStep2Next}
                  className="gradient-purple text-white gap-2 text-xs h-10 px-6 rounded-xl"
                >
                  Next: Branding <ArrowRight size={14} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="glass-effect border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-400" /> Initial
                    Theme & Aesthetics
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Set your brand accent color. You can fine-tune all
                    appearance settings later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">
                      Primary Accent Color
                    </Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-16 rounded-xl bg-transparent border border-border cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 text-xs font-mono bg-background border-border max-w-[140px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="gap-2 text-xs h-10 px-5 rounded-xl"
                >
                  <ArrowLeft size={14} /> Back
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={loading}
                  className="gradient-purple text-white gap-2 text-xs h-10 px-6 rounded-xl shadow-md"
                >
                  <Sparkles size={14} />
                  {loading ? "Creating Store..." : "Complete & Launch"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Your Store is Ready!
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                <strong className="text-foreground">{storeName}</strong> has
                been initialized with tenant database isolation, SaaS
                entitlements, and AI copilot support.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="gradient-purple text-white text-xs h-10 px-6 rounded-xl"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/products")}
                  className="text-xs h-10 px-6 rounded-xl"
                >
                  Add First Product
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
};

export default OnboardingPage;

import type { GetServerSidePropsContext } from "next";

/**
 * Server-side admin auth gate for the Onboarding route.
 *
 * @param ctx - Next.js server-side context for the incoming request, including `req`/`res` and cookies.
 * @returns The {@link requireAdmin} result: `props` with the authenticated admin user, or a redirect to `/` / `/?error=admin_required` when the session is missing or not an admin.
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
