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
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useUser();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
  });

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const updateUserProfile = async (data: any) => {
    try {
      console.log(data);
      const name = data?.name;
      const response = await updateUserData(name);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const { showError } = useToast();
  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    if (!oldPassword || !newPassword) {
      showError("Please fill in all password fields");
      return;
    }
    try {
      const response = await updatePassword(oldPassword, newPassword);
      console.log("Password changed successfully:", response.data);
      // Optionally clear password inputs here
    } catch (err) {
      console.error(err);
      showError("Error updating password");
    }
  };

  
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white/20">
                <AvatarImage src={user?.avatar} />
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
                      {new Date(user?.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Orders</span>
                    <p className="font-medium">{user?.totalOrders}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Total Spent</span>
                    <p className="font-medium">
                      ${user?.totalSpent?.toFixed(2)}
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
            <TabsList className="grid w-full grid-cols-6 mb-8">
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
                        defaultValue={user?.email}
                        readOnly
                      />
                    </div>
                    <div className="grid gap-4">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        defaultValue="+1 (555) 123-4567"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
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
                          confirmPassword
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
              <OrderHistory />
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
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
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
