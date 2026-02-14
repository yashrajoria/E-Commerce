/**
 * Premium Profile Page
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Camera,
  Key,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
  Bell,
  Globe,
} from "lucide-react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { toast } from "sonner";
import jwt from "jsonwebtoken";

interface ProfileProps {
  initialName: string;
  initialEmail: string;
}

const Profile = ({ initialName, initialEmail }: ProfileProps) => {
  const [name, setName] = useState(initialName || "Admin User");
  const [email, setEmail] = useState(initialEmail || "admin@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageLayout title="Profile" breadcrumbs={[{ label: "Profile" }]}>
      <motion.section variants={pageItem}>
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="glass-effect rounded-xl p-1.5 inline-flex">
            <TabsList className="bg-transparent gap-1 h-auto p-0">
              {[
                { value: "profile", label: "Profile", icon: User },
                { value: "security", label: "Security", icon: Shield },
                { value: "notifications", label: "Notifications", icon: Bell },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs gap-2 transition-all"
                >
                  <Icon size={14} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Avatar Card */}
            <Card className="glass-effect border-white/[0.06] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-white/[0.08]">
                      <AvatarImage src={avatar || undefined} />
                      <AvatarFallback className="gradient-purple text-white text-2xl font-bold">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gradient">{name}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-purple-400/10 text-purple-400 border-purple-400/20 text-xs"
                    >
                      Admin
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info */}
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" /> Personal
                  Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Phone
                    </Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      Timezone
                    </Label>
                    <Input
                      value="UTC-5 (Eastern)"
                      disabled
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10 opacity-60"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="gradient-purple text-white border-0 rounded-xl gap-2"
                  >
                    <Save size={14} />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" /> Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirm Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] rounded-xl h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleChangePassword}
                    className="gradient-purple text-white border-0 rounded-xl gap-2"
                  >
                    <Key size={14} />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" /> Two-Factor
                  Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="font-medium text-sm">Enable 2FA</p>
                    <p className="text-xs text-muted-foreground">
                      Require a verification code when signing in
                    </p>
                  </div>
                  <Switch checked={twoFA} onCheckedChange={setTwoFA} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="glass-effect border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-400" /> Notification
                  Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  {
                    label: "Email Notifications",
                    desc: "Receive email updates about your account",
                    value: emailNotifs,
                    setter: setEmailNotifs,
                  },
                  {
                    label: "Push Notifications",
                    desc: "Receive push notifications in your browser",
                    value: pushNotifs,
                    setter: setPushNotifs,
                  },
                  {
                    label: "Order Updates",
                    desc: "Notifications about new orders and status changes",
                    value: orderNotifs,
                    setter: setOrderNotifs,
                  },
                  {
                    label: "Marketing Emails",
                    desc: "Tips, product updates and promotional content",
                    value: marketingNotifs,
                    setter: setMarketingNotifs,
                  },
                ].map(({ label, desc, value, setter }, i) => (
                  <div key={label}>
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch checked={value} onCheckedChange={setter} />
                    </div>
                    {i < 3 && <Separator className="bg-white/[0.04]" />}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token || "";
  let initialName = "";
  let initialEmail = "";

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.decode(token);
    if (decoded) {
      initialName = decoded.name || "";
      initialEmail = decoded.email || "";
    }
  } catch {
    // Token decode failed, use defaults
  }

  return { props: { initialName, initialEmail } };
};

export default Profile;
