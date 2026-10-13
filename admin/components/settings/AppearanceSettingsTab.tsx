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
import { Palette } from "lucide-react";

export interface AppearanceSettingsTabProps {
  primaryColor: string;
  setPrimaryColor: (v: string) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  primaryColor,
  setPrimaryColor,
  darkMode,
  setDarkMode,
}) => {
  return (
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
  );
};

