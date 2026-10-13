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
import { Mail } from "lucide-react";

export interface NotificationsSettingsTabProps {
  smtpHost: string;
  setSmtpHost: (v: string) => void;
  smtpPort: string;
  setSmtpPort: (v: string) => void;
  smtpSender: string;
  setSmtpSender: (v: string) => void;
}

export const NotificationsSettingsTab: React.FC<NotificationsSettingsTabProps> = ({
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpSender,
  setSmtpSender,
}) => {
  return (
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
  );
};

