import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Store as StoreIcon } from "lucide-react";

/** Props accepted by {@link GeneralSettingsTab}. */
export interface GeneralSettingsTabProps {
  /** Name of the active store, shown in the card description. */
  activeStoreName?: string;
  /** Controlled store display name. */
  storeName: string;
  /** Called with the next store name as the user types. */
  setStoreName: (v: string) => void;
  /** Immutable store slug, rendered read-only. */
  storeSlug: string;
  /** Controlled custom domain value. */
  storeDomain: string;
  /** Called with the next custom domain as the user types. */
  setStoreDomain: (v: string) => void;
  /** Controlled base-currency code. */
  currency: string;
  /** Called with the selected currency code when the select changes. */
  setCurrency: (v: string) => void;
  /** Controlled contact email address. */
  storeEmail: string;
  /** Called with the next contact email as the user types. */
  setStoreEmail: (v: string) => void;
  /** Controlled support phone number. */
  storePhone: string;
  /** Called with the next support phone number as the user types. */
  setStorePhone: (v: string) => void;
  /** Controlled storefront language code. */
  language: string;
  /** Called with the selected language code when the select changes. */
  setLanguage: (v: string) => void;
  /** Controlled IANA timezone identifier. */
  timezone: string;
  /** Called with the selected timezone when the select changes. */
  setTimezone: (v: string) => void;
  /** Controlled physical address of the store. */
  storeAddress: string;
  /** Called with the next address as the user types. */
  setStoreAddress: (v: string) => void;
  /** Whether maintenance mode disables customer purchases. */
  maintenanceMode: boolean;
  /** Called with the next maintenance-mode value when the switch toggles. */
  setMaintenanceMode: (v: boolean) => void;
}

/**
 * Renders the store information settings card with identity, localization, contact and maintenance controls.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <GeneralSettingsTab
 *   activeStoreName={activeStore?.name}
 *   storeName={storeName}
 *   setStoreName={setStoreName}
 *   storeSlug={storeSlug}
 *   storeDomain={storeDomain}
 *   setStoreDomain={setStoreDomain}
 *   currency={currency}
 *   setCurrency={setCurrency}
 *   storeEmail={storeEmail}
 *   setStoreEmail={setStoreEmail}
 *   storePhone={storePhone}
 *   setStorePhone={setStorePhone}
 *   language={language}
 *   setLanguage={setLanguage}
 *   timezone={timezone}
 *   setTimezone={setTimezone}
 *   storeAddress={storeAddress}
 *   setStoreAddress={setStoreAddress}
 *   maintenanceMode={maintenanceMode}
 *   setMaintenanceMode={setMaintenanceMode}
 * />
 * ```
 */
export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  activeStoreName,
  storeName,
  setStoreName,
  storeSlug,
  storeDomain,
  setStoreDomain,
  currency,
  setCurrency,
  storeEmail,
  setStoreEmail,
  storePhone,
  setStorePhone,
  language,
  setLanguage,
  timezone,
  setTimezone,
  storeAddress,
  setStoreAddress,
  maintenanceMode,
  setMaintenanceMode,
}) => {
  return (
    <Card className="glass-effect border-white/[0.06]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <StoreIcon className="h-5 w-5 text-purple-400" /> Store Information
        </CardTitle>
        <CardDescription>
          Configure core identity and localization for{" "}
          <span className="font-semibold text-foreground">
            {activeStoreName}
          </span>
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
              <option value="America/Los_Angeles">
                America/Los_Angeles (PST)
              </option>
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
              Temporarily disable customer purchases and show an under
              maintenance banner
            </p>
          </div>
          <Switch
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};
