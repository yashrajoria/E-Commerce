"use client";

import { AddressBook } from "@/components/account/address-book";
import { OrderHistory } from "@/components/account/order-history";
import { SubscriptionsManager } from "@/components/account/SubscriptionsManager";
import { WishlistItems } from "@/components/account/wishlist-items";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { updatePassword, updateUserData } from "@/lib/user";
import { motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  RefreshCw,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { user, loading, signOut, refetchUser } = useUser();
  const { wishlist: localWishlist } = useWishlist();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const safeString = (v: unknown) => (v == null ? "" : String(v));
  const safeDateFrom = (v: unknown): Date | null => {
    if (v == null) return null;
    if (typeof v === "string" || typeof v === "number") {
      const d = new Date(v);
      return Number.isFinite(d.getTime()) ? d : null;
    }
    return null;
  };
  const safeNumber = (v: unknown) => {
    if (v == null) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getNested = (obj: unknown, ...keys: string[]) => {
    let cur = obj as unknown;
    for (const k of keys) {
      if (!cur || typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[k];
    }
    return cur as unknown;
  };

  useEffect(() => {
    const baseProfile = (user?.profile ?? {}) as Record<string, unknown>;
    setProfile({
      name: safeString(user?.name ?? baseProfile.name),
      email: safeString(user?.email ?? baseProfile.email),
      phone_number: safeString(user?.phone_number ?? baseProfile.phone_number),
    });
    const tabQuery = router.query.tab;
    const tab = Array.isArray(tabQuery) ? tabQuery[0] : tabQuery;
    if (tab) {
      setActiveTab(tab);
    }
  }, [router.query.tab, user]);

  const { showError, showSuccess } = useToast();

  const updateUserProfile = async (data: typeof profile) => {
    try {
      const updates: Partial<typeof profile> = {};
      const original = {
        name: safeString(user?.name ?? (user?.profile as Record<string, unknown>)?.name),
        email: safeString(user?.email ?? (user?.profile as Record<string, unknown>)?.email),
        phone_number: safeString(
          user?.phone_number ?? (user?.profile as Record<string, unknown>)?.phone_number,
        ),
      };

      if (data.name !== original.name) updates.name = data.name;
      if (data.email !== original.email) updates.email = data.email;
      if (data.phone_number !== original.phone_number)
        updates.phone_number = data.phone_number;

      if (Object.keys(updates).length === 0) {
        return;
      }

      await updateUserData(updates);
      await refetchUser();
      showSuccess("Profile updated successfully.");
    } catch {
      showError("Could not update profile. Please try again.");
    }
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    if (newPassword !== confirmPassword) {
      showError("New password and confirm password do not match");
      return;
    }
    if (!oldPassword || !newPassword) {
      showError("Please fill in all password fields");
      return;
    }
    try {
      await updatePassword(oldPassword, newPassword);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess("Password updated successfully");
    } catch {
      showError("Error updating password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Head>
          <title>My Account | ShopSwift</title>
          <meta
            name="description"
            content="Manage your profile, orders, and preferences."
          />
          <link rel="canonical" href={`${siteUrl}/account`} />
        </Head>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>My Account | ShopSwift</title>
        <meta
          name="description"
          content="Manage your profile, orders, and preferences."
        />
        <link rel="canonical" href={`${siteUrl}/account`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Header */}
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <Avatar className="w-16 h-16 border border-border bg-muted text-foreground">
                  <AvatarImage src={user?.avatar ?? undefined} />
                  <AvatarFallback className="text-lg font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                      {user?.name || "Member Account"}
                    </h1>
                    <Badge variant="secondary" className="text-[10px] py-0 px-2 font-normal">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-border w-full sm:w-auto">
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Orders
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {safeNumber(getNested((user as Record<string, unknown>)?.orders, "meta", "total_orders"))}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Wishlist
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {((user as Record<string, unknown>)?.wishlist as unknown[])?.length ?? localWishlist.length ?? 0}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Member Since
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {(() => {
                      const d = safeDateFrom(
                        user?.created_at ?? (user?.profile as Record<string, unknown>)?.created_at,
                      );
                      return d ? d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—";
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 h-auto p-1 bg-surface border border-border rounded-lg">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <User className="h-3.5 w-3.5" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <Package className="h-3.5 w-3.5" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                <span>Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Wishlist</span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Addresses</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Payment</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-1.5 py-2 text-xs font-medium"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-medium text-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        readOnly
                        className="h-10 text-sm bg-muted/50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone_number" className="text-xs font-medium text-foreground">
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        value={profile.phone_number}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone_number: e.target.value,
                          })
                        }
                        placeholder="+44 7700 900000"
                        className="h-10 text-sm"
                      />
                    </div>
                    <Button
                      onClick={() => updateUserProfile(profile)}
                      size="sm"
                      className="mt-2"
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">
                    Account Security
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="currentPassword" className="text-xs font-medium text-foreground">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-10 text-sm"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        handleChangePassword(
                          password,
                          newPassword,
                          confirmPassword,
                        )
                      }
                      size="sm"
                      variant="outline"
                      className="mt-2"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrderHistory orders={user?.orders} />
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions">
              <SubscriptionsManager />
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <WishlistItems />
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <AddressBook />
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment">
              <div className="bg-surface border border-border rounded-lg p-6 max-w-xl">
                <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">
                  Payment Methods
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-md bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-muted border border-border rounded flex items-center justify-center text-foreground text-[10px] font-bold tracking-wider">
                        VISA
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">•••• •••• •••• 4242</p>
                        <p className="text-[11px] text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      Default
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 max-w-2xl">
              <div className="bg-surface border border-border rounded-lg p-6 space-y-5">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Preferences
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-muted-foreground">Receive order updates and dispatch notices.</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Preferences
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Privacy & Data</p>
                        <p className="text-muted-foreground">Manage cookies and data retention.</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Session &amp; Account
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sign out from your current device or manage your account status.
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await signOut();
                      router.push("/");
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Sign Out
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
