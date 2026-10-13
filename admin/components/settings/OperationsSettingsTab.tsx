import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Truck, CreditCard, Database } from "lucide-react";

export const ShippingSettingsCard: React.FC = () => {
  return (
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
  );
};

export const PaymentsSettingsCard: React.FC = () => {
  return (
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
  );
};

export interface AdvancedSettingsCardProps {
  autoBackup: boolean;
  setAutoBackup: (v: boolean) => void;
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (v: boolean) => void;
}

export const AdvancedSettingsCard: React.FC<AdvancedSettingsCardProps> = ({
  autoBackup,
  setAutoBackup,
  analyticsEnabled,
  setAnalyticsEnabled,
}) => {
  return (
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
  );
};

