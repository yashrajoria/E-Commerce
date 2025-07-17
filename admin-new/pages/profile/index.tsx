"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Camera,
  CameraIcon,
  Lock,
  Mail,
  Moon,
  Phone,
  Shield,
  Smartphone,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProfile } from "@/types/admin";
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["super_admin", "admin", "editor"]),
  twoFactorEnabled: z.boolean(),
  notificationPreferences: z.object({
    email: z.boolean(),
    push: z.boolean(),
    desktop: z.boolean(),
  }),
  theme: z.enum(["light", "dark", "system"]),
});

export default function ProfilePage({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/placeholder-avatar.png");

  // Mock admin data - replace with actual API call
  const mockAdmin: AdminProfile = {
    _id: "admin-123",
    name: name,
    email: email,
    role: "admin",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder-avatar.png",
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
    notificationPreferences: {
      email: true,
      push: true,
      desktop: false,
    },
    theme: "system",
    permissions: ["manage_users", "manage_content", "view_analytics"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z",
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name,
      email: mockAdmin.email,
      phone: mockAdmin.phone,
      role: mockAdmin.role,
      twoFactorEnabled: mockAdmin.twoFactorEnabled,
      notificationPreferences: mockAdmin.notificationPreferences,
      theme: mockAdmin.theme,
    },
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form data:", data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <div className="flex-1">
        <header className="border-b border-border/40 /70 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
          <div className="h-16 px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="border-teal-200 text-teal-700"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="bg-teal-500"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="px-8 pb-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="p-0 bg-transparent border-b border-border/40 w-full flex justify-start h-12 space-x-8">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-teal-700 rounded-none border-b-2 border-transparent px-0 pb-3 bg-transparent data-[state=active]:shadow-white shadow-sm"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-teal-700 rounded-none border-b-2 border-transparent px-0 pb-3 bg-transparent data-[state=active]:shadow-white shadow-sm"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-teal-700 rounded-none border-b-2 border-transparent px-0 pb-3 bg-transparent data-[state=active]:shadow-white shadow-sm"
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <FormItem
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  {/* Profile Tab */}
                  <TabsContent value="profile" className="mt-0 space-y-6">
                    <div className=" rounded-xl p-6 shadow-white shadow-md">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 mb-6 border-b border-border/40">
                        <div className="relative group">
                          <Avatar className="w-24 h-24 border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                            <AvatarImage src={avatarPreview} alt={name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                              {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="absolute -bottom-2 -right-2">
                            <Label
                              htmlFor="avatar-upload"
                              className="cursor-pointer"
                            >
                              <div className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                                <Camera size={14} />
                              </div>
                              <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2 flex-1">
                          <h2 className="text-xl font-medium">{name}</h2>
                          <p className="text-muted-foreground">{email}</p>
                          <div className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {mockAdmin.role
                              .replace("_", " ")
                              .charAt(0)
                              .toUpperCase() +
                              mockAdmin.role.replace("_", " ").slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-9 border-border/40 focus:border-teal-300"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-9 border-border/40 focus:border-teal-300"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-9 border-border/40 focus:border-teal-300"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Role
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-border/40 w-full">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="glass-effect">
                                  <SelectItem value="super_admin">
                                    Super Admin
                                  </SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security" className="mt-0 space-y-6">
                    <div className=" rounded-xl p-6 shadow-card border border-border/40">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Shield size={18} className="text-teal-500" />
                          Password & Security
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Manage your password and security preferences
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FormField
                          control={form.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Current Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="password"
                                    className="pl-9 border-border/40 focus:border-teal-300"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                New Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="password"
                                    className="pl-9 border-border/40 focus:border-teal-300"
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Must be at least 6 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <FormField
                          control={form.control}
                          name="twoFactorEnabled"
                          render={({ field }) => (
                            <div className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-md transition-colors">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-teal-500" />
                                  Two-Factor Authentication
                                </div>
                                <FormDescription className="text-xs">
                                  Add an extra layer of security to your account
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-teal-500"
                                />
                              </FormControl>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="mt-0 space-y-6">
                    <div className=" rounded-xl p-6 shadow-card border border-border/40">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Bell size={18} className="text-teal-500" />
                          Notification Preferences
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Customize your notification and display settings
                        </p>
                      </div>

                      <div className="space-y-1">
                        <FormField
                          control={form.control}
                          name="notificationPreferences.email"
                          render={({ field }) => (
                            <div className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-md transition-colors">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-teal-500" />
                                  Email Notifications
                                </div>
                                <FormDescription className="text-xs">
                                  Receive notifications via email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-teal-500"
                                />
                              </FormControl>
                            </div>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notificationPreferences.push"
                          render={({ field }) => (
                            <div className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-md transition-colors">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <Bell className="h-4 w-4 text-teal-500" />
                                  Push Notifications
                                </div>
                                <FormDescription className="text-xs">
                                  Receive push notifications in your browser
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-teal-500"
                                />
                              </FormControl>
                            </div>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notificationPreferences.desktop"
                          render={({ field }) => (
                            <div className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-md transition-colors">
                              <div className="space-y-0.5">
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <Smartphone className="h-4 w-4 text-teal-500" />
                                  Desktop Notifications
                                </div>
                                <FormDescription className="text-xs">
                                  Receive notifications on your desktop
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-teal-500"
                                />
                              </FormControl>
                            </div>
                          )}
                        />

                        <Separator className="my-6" />

                        <FormField
                          control={form.control}
                          name="theme"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2 mb-2">
                                <Moon className="h-4 w-4 text-teal-500" />
                                <FormLabel className="text-sm font-medium">
                                  Theme Preference
                                </FormLabel>
                              </div>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-border/40">
                                    <SelectValue placeholder="Select a theme" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </FormItem>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.cookies["token"];
  const token = cookie ? cookie : null;
  let name: string | null = null;
  let email: string | null = null;
  const decoded = token
    ? jwt.verify(token, process.env.JWT_SECRET as string)
    : null;
  if (decoded && typeof decoded === "object" && "name" in decoded) {
    name = (decoded as { name?: string }).name ?? null;
    email = (decoded as { username?: string }).username ?? null;
  }

  if (!decoded) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      name,
      email,
    },
  };
};
