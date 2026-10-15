/**
 * Premium Multi-Tenant Settings & Billing Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Palette,
  CreditCard,
  Mail,
  Save,
  Truck,
  Store as StoreIcon,
  Database,
  Zap,
  Users,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useStore } from "@/lib/useStore";
import type {
  Plan,
  StoreSubscription,
  StoreMembership,
} from "@ecommerce/shared";
import {
  GeneralSettingsTab,
  BillingSettingsTab,
  TeamSettingsTab,
  AppearanceSettingsTab,
  NotificationsSettingsTab,
  ShippingSettingsCard,
  PaymentsSettingsCard,
  AdvancedSettingsCard,
} from "@/components/settings";

/**
 * Renders the multi-tenant settings workspace with eight settings tabs and a global save action.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Settings, plans, subscription, and members are loaded from the `/api/bff/admin/stores/:id` endpoints for the {@link useStore} active store.
 *
 * @example
 * ```tsx
 * // Route: /settings — rendered by the Next.js Pages Router.
 * <Settings />
 * ```
 */
const Settings = () => {
  const { activeStore, refreshStores } = useStore();

  // General store settings
  const [storeName, setStoreName] = useState("My Store");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeDomain, setStoreDomain] = useState("");
  const [storeEmail, setStoreEmail] = useState("store@example.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 000-0000");
  const [storeAddress, setStoreAddress] = useState(
    "123 Commerce St, Business City",
  );
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Appearance & Theme
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [darkMode, setDarkMode] = useState(true);

  // Email / SMTP
  const [smtpHost, setSmtpHost] = useState("smtp.example.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpSender, setSmtpSender] = useState("noreply@shopswift.app");

  // Advanced / Features
  const [autoBackup, setAutoBackup] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  // Billing & Subscription
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<StoreSubscription | null>(
    null,
  );
  const [billingLoading, setBillingLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Team & Staff
  const [members, setMembers] = useState<StoreMembership[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);

  // Load store settings when activeStore changes
  const loadStoreData = useCallback(async () => {
    if (!activeStore?.id) return;

    setStoreName(activeStore.name || "");
    setStoreSlug(activeStore.slug || "");
    setStoreDomain(activeStore.domain || "");
    setCurrency(activeStore.currency || "USD");

    try {
      const res = await axios.get(
        `/api/bff/admin/stores/${activeStore.id}/settings`,
        {
          withCredentials: true,
        },
      );
      const settings = res.data?.settings;
      if (settings) {
        if (settings.theme_config) {
          setPrimaryColor(settings.theme_config.primary_color || "#6366f1");
          setDarkMode(settings.theme_config.dark_mode ?? true);
        }
        if (settings.notification_config?.smtp) {
          setSmtpHost(
            settings.notification_config.smtp.host || "smtp.example.com",
          );
          setSmtpPort(settings.notification_config.smtp.port || "587");
          setSmtpSender(
            settings.notification_config.smtp.sender || "noreply@shopswift.app",
          );
        }
        if (settings.features) {
          setAutoBackup(settings.features.auto_backup ?? true);
          setAnalyticsEnabled(settings.features.analytics ?? true);
        }
      }
    } catch (err) {
      console.error("Failed to load store settings:", err);
    }

    // Load plans, subscription & members
    try {
      setBillingLoading(true);
      const [plansRes, subRes, membersRes] = await Promise.allSettled([
        axios.get("/api/bff/admin/plans", { withCredentials: true }),
        axios.get(`/api/bff/admin/stores/${activeStore.id}/subscription`, {
          withCredentials: true,
        }),
        axios.get(`/api/bff/admin/stores/${activeStore.id}/members`, {
          withCredentials: true,
        }),
      ]);

      if (plansRes.status === "fulfilled" && plansRes.value.data?.plans) {
        setPlans(plansRes.value.data.plans);
      }
      if (subRes.status === "fulfilled" && subRes.value.data?.subscription) {
        setSubscription(subRes.value.data.subscription);
      }
      if (membersRes.status === "fulfilled" && membersRes.value.data?.members) {
        setMembers(membersRes.value.data.members);
      }
    } catch (err) {
      console.error("Failed to load subscription details:", err);
    } finally {
      setBillingLoading(false);
    }
  }, [activeStore]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStore?.id || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      await axios.post(
        `/api/bff/admin/stores/${activeStore.id}/invite`,
        { email: inviteEmail.trim(), role: inviteRole },
        { withCredentials: true },
      );
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      const res = await axios.get(
        `/api/bff/admin/stores/${activeStore.id}/members`,
        { withCredentials: true },
      );
      if (res.data?.members) setMembers(res.data.members);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to invite member"
        : "Failed to invite member";
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeStore?.id) return;
    try {
      await axios.delete(
        `/api/bff/admin/stores/${activeStore.id}/members/${userId}`,
        { withCredentials: true },
      );
      toast.success("Team member removed");
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to remove member"
        : "Failed to remove member";
      toast.error(msg);
    }
  };

  const handleSave = async () => {
    if (!activeStore?.id) {
      toast.error("No active store selected");
      return;
    }

    setSaving(true);
    try {
      await axios.put(
        `/api/bff/admin/stores/${activeStore.id}`,
        {
          name: storeName,
          currency: currency,
          domain: storeDomain || undefined,
        },
        { withCredentials: true },
      );

      await axios.put(
        `/api/bff/admin/stores/${activeStore.id}/settings`,
        {
          theme_config: {
            primary_color: primaryColor,
            dark_mode: darkMode,
          },
          notification_config: {
            smtp: {
              host: smtpHost,
              port: smtpPort,
              sender: smtpSender,
            },
          },
          features: {
            auto_backup: autoBackup,
            analytics: analyticsEnabled,
            maintenance_mode: maintenanceMode,
          },
        },
        { withCredentials: true },
      );

      await refreshStores();
      toast.success("Store configuration and settings saved successfully!");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save settings"
        : "Failed to save settings";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    if (!activeStore?.id) return;
    try {
      const res = await axios.post(
        `/api/bff/admin/stores/${activeStore.id}/subscription`,
        { plan_id: planId },
        { withCredentials: true },
      );
      setSubscription(res.data?.subscription);
      toast.success("Subscription plan updated successfully!");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update plan"
        : "Failed to update plan";
      toast.error(msg);
    }
  };

  return (
    <PageLayout
      title="Settings"
      breadcrumbs={[{ label: "Settings" }]}
      headerActions={
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gradient-purple text-white gap-2 text-xs h-9 px-4 rounded-xl shadow-xs"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <motion.section variants={pageItem}>
        <Tabs defaultValue="general" className="space-y-6">
          <div className="glass-effect rounded-xl p-1.5 inline-flex flex-wrap">
            <TabsList className="bg-transparent gap-1 h-auto p-0 flex-wrap">
              {[
                { value: "general", label: "General", icon: StoreIcon },
                { value: "billing", label: "Billing & Plans", icon: Zap },
                { value: "team", label: "Team & Staff", icon: Users },
                { value: "appearance", label: "Appearance", icon: Palette },
                { value: "notifications", label: "Email / SMTP", icon: Mail },
                { value: "shipping", label: "Shipping", icon: Truck },
                { value: "payments", label: "Payments", icon: CreditCard },
                { value: "advanced", label: "Advanced", icon: Database },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-3 py-2 text-xs gap-2 transition-all"
                >
                  <Icon size={13} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-6 mt-6">
            <GeneralSettingsTab
              activeStoreName={activeStore?.name}
              storeName={storeName}
              setStoreName={setStoreName}
              storeSlug={storeSlug}
              storeDomain={storeDomain}
              setStoreDomain={setStoreDomain}
              currency={currency}
              setCurrency={setCurrency}
              storeEmail={storeEmail}
              setStoreEmail={setStoreEmail}
              storePhone={storePhone}
              setStorePhone={setStorePhone}
              language={language}
              setLanguage={setLanguage}
              timezone={timezone}
              setTimezone={setTimezone}
              storeAddress={storeAddress}
              setStoreAddress={setStoreAddress}
              maintenanceMode={maintenanceMode}
              setMaintenanceMode={setMaintenanceMode}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6 mt-6">
            <BillingSettingsTab
              plans={plans}
              subscription={subscription}
              billingLoading={billingLoading}
              onUpgradePlan={handleUpgradePlan}
            />
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <TeamSettingsTab
              activeStoreName={activeStore?.name}
              members={members}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              inviteRole={inviteRole}
              setInviteRole={setInviteRole}
              inviting={inviting}
              onInviteMember={handleInviteMember}
              onRemoveMember={handleRemoveMember}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <AppearanceSettingsTab
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <NotificationsSettingsTab
              smtpHost={smtpHost}
              setSmtpHost={setSmtpHost}
              smtpPort={smtpPort}
              setSmtpPort={setSmtpPort}
              smtpSender={smtpSender}
              setSmtpSender={setSmtpSender}
            />
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6 mt-6">
            <ShippingSettingsCard />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6 mt-6">
            <PaymentsSettingsCard />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <AdvancedSettingsCard
              autoBackup={autoBackup}
              setAutoBackup={setAutoBackup}
              analyticsEnabled={analyticsEnabled}
              setAnalyticsEnabled={setAnalyticsEnabled}
            />
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Settings;

import type { GetServerSidePropsContext } from "next";

/**
 * Server-side admin auth gate for the Settings route.
 *
 * @param ctx - Next.js server-side context for the incoming request, including `req`/`res` and cookies.
 * @returns The {@link requireAdmin} result: `props` with the authenticated admin user, or a redirect to `/` / `/?error=admin_required` when the session is missing or not an admin.
 */
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
