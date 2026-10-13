/**
 * Premium Multi-Tenant Settings & Billing Page
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  Check,
  Users,
  UserPlus,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useStore } from "@/lib/useStore";
import type { Plan, StoreSubscription, StoreMembership } from "@ecommerce/shared";

const Settings = () => {
  const { activeStore, refreshStores } = useStore();

  // General store settings
  const [storeName, setStoreName] = useState("My Store");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeDomain, setStoreDomain] = useState("");
  const [storeEmail, setStoreEmail] = useState("store@example.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 000-0000");
  const [storeAddress, setStoreAddress] = useState("123 Commerce St, Business City");
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
  const [subscription, setSubscription] = useState<StoreSubscription | null>(null);
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
      const res = await axios.get(`/api/bff/admin/stores/${activeStore.id}/settings`, {
        withCredentials: true,
      });
      const settings = res.data?.settings;
      if (settings) {
        if (settings.theme_config) {
          setPrimaryColor(settings.theme_config.primary_color || "#6366f1");
          setDarkMode(settings.theme_config.dark_mode ?? true);
        }
        if (settings.notification_config?.smtp) {
          setSmtpHost(settings.notification_config.smtp.host || "smtp.example.com");
          setSmtpPort(settings.notification_config.smtp.port || "587");
          setSmtpSender(settings.notification_config.smtp.sender || "noreply@shopswift.app");
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
        axios.get(`/api/bff/admin/stores/${activeStore.id}/subscription`, { withCredentials: true }),
        axios.get(`/api/bff/admin/stores/${activeStore.id}/members`, { withCredentials: true }),
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
        { withCredentials: true }
      );
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      const res = await axios.get(`/api/bff/admin/stores/${activeStore.id}/members`, { withCredentials: true });
      if (res.data?.members) setMembers(res.data.members);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || "Failed to invite member"
        : "Failed to invite member";
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeStore?.id) return;
    try {
      await axios.delete(`/api/bff/admin/stores/${activeStore.id}/members/${userId}`, { withCredentials: true });
      toast.success("Team member removed");
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || "Failed to remove member"
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
      // 1. Update basic store metadata
      await axios.put(
        `/api/bff/admin/stores/${activeStore.id}`,
        {
          name: storeName,
          currency: currency,
          domain: storeDomain || undefined,
        },
        { withCredentials: true }
      );

      // 2. Update store settings JSON
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
        { withCredentials: true }
      );

      await refreshStores();
      toast.success("Store configuration and settings saved successfully!");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || "Failed to save settings"
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
        { withCredentials: true }
      );
      setSubscription(res.data?.subscription);
      toast.success("Subscription plan updated successfully!");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || "Failed to update plan"
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

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StoreIcon className="h-5 w-5 text-purple-400" /> Store Information
                </CardTitle>
                <CardDescription>
                  Configure core identity and localization for{" "}
                  <span className="font-semibold text-foreground">{activeStore?.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Store Name</Label>
                    <Input
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Store Slug</Label>
                    <Input
                      value={storeSlug}
                      disabled
                      className="bg-white/[0.02] border-white/[0.06] rounded-xl h-10 text-xs font-mono text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Custom Domain (Pro & Business)</Label>
                    <Input
                      placeholder="e.g. shop.brand.com"
                      value={storeDomain}
                      onChange={(e) => setStoreDomain(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Base Currency</Label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Contact Email</Label>
                    <Input
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Support Phone</Label>
                    <Input
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Language</Label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Timezone</Label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Physical Address</Label>
                  <Textarea
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] rounded-xl text-xs"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Temporarily disable customer purchases and show an under maintenance banner
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing & Subscription Tab */}
          <TabsContent value="billing" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-400" /> Subscription & SaaS Tier
                    </CardTitle>
                    <CardDescription>
                      Manage plan quotas, AI query limits, and feature entitlements for this store
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-primary/40 text-primary capitalize px-3 py-1">
                    Current Plan: {plans.find((p) => p.id === subscription?.plan_id)?.name || "Free"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {billingLoading ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">Loading subscription details...</div>
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
                              <h3 className="font-bold text-base text-foreground">{plan.name}</h3>
                              {isCurrent && (
                                <Badge className="bg-primary text-white text-[10px]">Active</Badge>
                              )}
                            </div>
                            <div className="mb-4">
                              <span className="text-2xl font-black text-foreground">
                                ${plan.price_monthly}
                              </span>
                              <span className="text-xs text-muted-foreground"> / month</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">
                              {plan.slug === "free" && "Essential tools to start selling and test your storefront."}
                              {plan.slug === "pro" && "High-volume commerce with copilot agent and custom domains."}
                              {plan.slug === "business" && "Full enterprise autonomy with limitless scale and priority queues."}
                            </p>

                            <Separator className="bg-white/[0.06] mb-4" />

                            <ul className="space-y-2.5 text-xs">
                              {plan.entitlements?.map((e) => (
                                <li key={e.feature_key} className="flex items-center gap-2 text-foreground/80">
                                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span>
                                    {e.feature_key === "max_products" && `${e.quota_limit ?? e.limit_value ?? 100} Products`}
                                    {e.feature_key === "ai_queries_monthly" && `${e.quota_limit ?? e.limit_value ?? 50} AI Copilot Queries/mo`}
                                    {e.feature_key === "custom_domain" && "Custom Domain Support"}
                                    {e.feature_key === "priority_support" && "Priority 24/7 SLA"}
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
                              onClick={() => handleUpgradePlan(plan.id)}
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
          </TabsContent>

          {/* Team & Staff Management Tab */}
          <TabsContent value="team" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-purple-400" /> Invite Staff Member
                </CardTitle>
                <CardDescription>
                  Grant team members access to manage catalog, orders, and promotions for {activeStore?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteMember} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="teammate@company.com"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="h-10 text-xs bg-white/[0.04] border-white/[0.08] rounded-xl flex-1"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring sm:w-36"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <Button
                    type="submit"
                    disabled={inviting || !inviteEmail.trim()}
                    className="gradient-purple text-white gap-2 text-xs h-10 px-5 rounded-xl shrink-0"
                  >
                    <UserPlus size={14} />
                    {inviting ? "Inviting..." : "Send Invite"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" /> Active Members ({members.length})
                </CardTitle>
                <CardDescription>Team members with authorized roles in this store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No additional staff members yet.</p>
                ) : (
                  members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {(m.user?.name || m.user?.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {m.user?.name || m.user?.email || "Team Member"}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {m.user?.email || m.user_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="capitalize text-[10px] border-primary/30 text-primary"
                        >
                          {m.role}
                        </Badge>
                        {m.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(m.user_id)}
                            className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" /> Branding & Theme
                </CardTitle>
                <CardDescription>Customize the storefront and admin color palette</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Primary Brand Accent</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-14 rounded-lg bg-transparent border border-white/[0.1] cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-medium">Dark Mode Interface</p>
                    <p className="text-xs text-muted-foreground">Default to dark glassmorphism theme</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications / SMTP */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-400" /> Email & SMTP Delivery
                </CardTitle>
                <CardDescription>Configure outgoing transactional emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">SMTP Host</Label>
                    <Input
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">SMTP Port</Label>
                    <Input
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Sender Address</Label>
                  <Input
                    value={smtpSender}
                    onChange={(e) => setSmtpSender(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-400" /> Shipping & Fulfillment
                </CardTitle>
                <CardDescription>Delivery rules and shipping carrier integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Standard Shipping (3-5 days)", cost: "$5.00", enabled: true },
                  { name: "Express Next-Day Air", cost: "$15.00", enabled: true },
                  { name: "Free Shipping on orders > $100", cost: "$0.00", enabled: true },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.cost}</p>
                    </div>
                    <Switch defaultChecked={s.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" /> Payment Gateways
                </CardTitle>
                <CardDescription>Accept cards and digital wallets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Stripe Card Processing", status: "Connected", enabled: true },
                  { name: "Apple Pay & Google Pay", status: "Active", enabled: true },
                  { name: "Cash on Delivery", status: "Optional", enabled: false },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-0.5 ${
                          p.status === "Connected" || p.status === "Active"
                            ? "text-emerald-400 border-emerald-400/20"
                            : "text-muted-foreground border-white/[0.08]"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <Switch defaultChecked={p.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" /> Platform & Auditing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Auto Backup",
                    desc: "Automatically backup catalog snapshots daily",
                    value: autoBackup,
                    setter: setAutoBackup,
                  },
                  {
                    label: "Analytics & Telemetry",
                    desc: "Collect real-time performance and cart conversion metrics",
                    value: analyticsEnabled,
                    setter: setAnalyticsEnabled,
                  },
                ].map(({ label, desc, value, setter }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch checked={value} onCheckedChange={setter} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Settings;

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
