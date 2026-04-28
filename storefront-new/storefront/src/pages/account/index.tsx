"use client";

import { AddressBook } from "@/components/account/address-book";
import { OrderHistory } from "@/components/account/order-history";
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
import { formatGBP } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
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
    const baseProfile = (user?.profile ?? {}) as Record<string, any>;
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

  const updateUserProfile = async (data: typeof profile) => {
    try {
      // Compare each field with original user data, include only changed fields
      const updates: Partial<typeof profile> = {};

      const original = {
        name: safeString(user?.name ?? (user?.profile as any)?.name),
        email: safeString(user?.email ?? (user?.profile as any)?.email),
        phone_number: safeString(
          user?.phone_number ?? (user?.profile as any)?.phone_number,
        ),
      };

      if (data.name !== original.name) updates.name = data.name;
      if (data.email !== original.email) updates.email = data.email;
      if (data.phone_number !== original.phone_number)
        updates.phone_number = data.phone_number;

      // If no changes, avoid API call
      if (Object.keys(updates).length === 0) {
        return;
      }

      await updateUserData(updates);
      await refetchUser();
    } catch (error) {
      // logger.error("Error updating profile:", { error });
      showError("Could not update profile. Please try again.");
    }
  };

  const { showError, showSuccess } = useToast();
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
    } catch (err) {
      // logger.error("Error loading profile", { err });
      showError("Error updating password");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Head>
          <title>ShopSwift | Account</title>
          <meta
            name="description"
            content="Manage your profile, orders, and preferences."
          />
          <link rel="canonical" href={`${siteUrl}/account`} />
          <meta property="og:title" content="ShopSwift | Account" />
          <meta
            property="og:description"
            content="Manage your profile, orders, and preferences."
          />
          <meta property="og:url" content={`${siteUrl}/account`} />
        </Head>
        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <p className="ml-3 text-lg text-muted-foreground">
          Loading user profile...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Head>
        <title>ShopSwift | Account</title>
        <meta
          name="description"
          content="Manage your profile, orders, and preferences."
        />
        <link rel="canonical" href={`${siteUrl}/account`} />
        <meta property="og:title" content="ShopSwift | Account" />
        <meta
          property="og:description"
          content="Manage your profile, orders, and preferences."
        />
        <meta property="og:url" content={`${siteUrl}/account`} />
      </Head>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-linear-to-r from-rose-600 to-amber-500 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={user?.avatar ?? undefined} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-white/80 mb-4">{user?.email}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-white/60">Member since</span>
                    <p className="font-medium">
                      {(() => {
                        const d = safeDateFrom(
                          user?.created_at ?? (user?.profile as any)?.created_at,
                        );
                        return d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—";
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Orders</span>
                    <p className="font-medium">
                      {safeNumber(getNested((user as any)?.orders, "meta", "total_orders"))}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Wishlist</span>
                    <p className="font-medium">
                      {(user as any)?.wishlist?.length ?? localWishlist.length ?? 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Spent</span>
                    <p className="font-medium">
                      {formatGBP(safeNumber(user?.totalSpent))}
                    </p>
                  </div>
                </div>
              </div>

              <Badge className="bg-white/20 text-white">Premium Member</Badge>
            </div>
          </div>

          {/* Account Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger
                value="profile"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div
                className="grid md:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        readOnly
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label htmlFor="phone_number">Phone</Label>
                      <Input
                        id="phone_number"
                        value={profile.phone_number}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={() => updateUserProfile(profile)}>
                      Update Profile
                    </Button>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Account Security
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="orders">
              <OrderHistory orders={user?.orders} />
            </TabsContent>

            <TabsContent value="wishlist">
              <WishlistItems />
            </TabsContent>

            <TabsContent value="addresses">
              <AddressBook />
            </TabsContent>

            <TabsContent value="payment">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Payment Methods
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-linear-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">
                            Expires 12/25
                          </p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add New Payment Method
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your orders
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className="text-sm text-muted-foreground">
                            Control your data and privacy
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-destructive">
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive"
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
