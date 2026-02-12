/**
 * Premium Settings Page
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Palette,
  CreditCard,
  Mail,
  Save,
  Truck,
  Store,
  Database,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [storeName, setStoreName] = useState("My E-Commerce Store");
  const [storeEmail, setStoreEmail] = useState("store@example.com");
  const [storePhone, setStorePhone] = useState("+1 (555) 000-0000");
  const [storeAddress, setStoreAddress] = useState(
    "123 Commerce St, Business City, BC 12345",
  );
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("America/New_York");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [smtpHost, setSmtpHost] = useState("smtp.example.com");
  const [smtpPort, setSmtpPort] = useState("587");

  const handleSave = () => toast.success("Settings saved successfully!");

  return (
    <PageLayout title="Settings" breadcrumbs={[{ label: "Settings" }]}>
      <motion.section variants={pageItem}>
        <Tabs defaultValue="general" className="space-y-6">
          <div className="glass-effect rounded-xl p-1.5 inline-flex flex-wrap">
            <TabsList className="bg-transparent gap-1 h-auto p-0 flex-wrap">
              {[
                { value: "general", label: "General", icon: Store },
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
                  <Store className="h-5 w-5 text-purple-400" /> Store
                  Information
                </CardTitle>
                <CardDescription>Basic store configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Store Name</Label>
                    <Input
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Contact Email</Label>
                    <Input
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      type="email"
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect-strong border-white/[0.08]">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Store Address</Label>
                  <Textarea
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] rounded-xl min-h-[80px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect-strong border-white/[0.08]">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect-strong border-white/[0.08]">
                        <SelectItem value="America/New_York">
                          Eastern (UTC-5)
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central (UTC-6)
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain (UTC-7)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific (UTC-8)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          GMT (UTC+0)
                        </SelectItem>
                        <SelectItem value="Asia/Kolkata">
                          IST (UTC+5:30)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSave}
                    className="gradient-purple text-white border-0 rounded-xl gap-2"
                  >
                    <Save size={14} />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" /> Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Dark Mode",
                    desc: "Use dark theme for the admin dashboard",
                    value: darkMode,
                    setter: setDarkMode,
                  },
                  {
                    label: "Maintenance Mode",
                    desc: "Show a maintenance page to visitors",
                    value: maintenanceMode,
                    setter: setMaintenanceMode,
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

          {/* Email / SMTP Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-400" /> SMTP
                  Configuration
                </CardTitle>
                <CardDescription>
                  Configure your email server for transactional emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">SMTP Host</Label>
                    <Input
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">SMTP Port</Label>
                    <Input
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Username</Label>
                    <Input
                      placeholder="SMTP username"
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Password</Label>
                    <Input
                      type="password"
                      placeholder="SMTP password"
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/[0.08] text-xs gap-2"
                  >
                    <Zap size={13} />
                    Test Connection
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="gradient-purple text-white border-0 rounded-xl gap-2 text-xs"
                  >
                    <Save size={13} />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-400" /> Shipping Methods
                </CardTitle>
                <CardDescription>
                  Configure available shipping options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    method: "Standard Shipping",
                    price: "$5.99",
                    time: "5-7 business days",
                    enabled: true,
                  },
                  {
                    method: "Express Shipping",
                    price: "$12.99",
                    time: "2-3 business days",
                    enabled: true,
                  },
                  {
                    method: "Overnight Shipping",
                    price: "$24.99",
                    time: "Next business day",
                    enabled: false,
                  },
                  {
                    method: "Free Shipping",
                    price: "Free",
                    time: "Orders over $50",
                    enabled: true,
                  },
                ].map((s) => (
                  <div
                    key={s.method}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg gradient-purple flex items-center justify-center">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.method}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.time} · {s.price}
                        </p>
                      </div>
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
                  <CreditCard className="h-5 w-5 text-purple-400" /> Payment
                  Gateways
                </CardTitle>
                <CardDescription>
                  Manage your payment provider integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Stripe", status: "Connected", enabled: true },
                  { name: "PayPal", status: "Connected", enabled: true },
                  {
                    name: "Razorpay",
                    status: "Not configured",
                    enabled: false,
                  },
                  {
                    name: "Cash on Delivery",
                    status: "Available",
                    enabled: true,
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg gradient-emerald flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] mt-0.5 ${p.status === "Connected" ? "text-emerald-400 border-emerald-400/20" : "text-muted-foreground border-white/[0.08]"}`}
                        >
                          {p.status}
                        </Badge>
                      </div>
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
                  <Database className="h-5 w-5 text-purple-400" /> System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Auto Backup",
                    desc: "Automatically backup data daily",
                    value: autoBackup,
                    setter: setAutoBackup,
                  },
                  {
                    label: "Analytics",
                    desc: "Collect usage analytics to improve the app",
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
                <Separator className="bg-white/[0.04]" />
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Danger Zone
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reset all settings to defaults
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl text-xs"
                  >
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Settings;
