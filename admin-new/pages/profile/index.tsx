"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Moon,
  Shield,
  Upload,
  Smartphone,
} from "lucide-react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AdminProfile } from "@/types/admin";

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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/placeholder-avatar.png");

  // Mock admin data - replace with actual API call
  const mockAdmin: AdminProfile = {
    _id: "admin-123",
    name: "John Doe",
    email: "admin@example.com",
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
      name: mockAdmin.name,
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

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center">
            <h1 className="text-xl font-semibold">Profile Settings</h1>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Profile Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={avatarPreview} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {mockAdmin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-background flex items-center justify-center">
                          <div className="status-dot status-active"></div>
                        </div>
                      </div>
                      <label className="cursor-pointer">
                        <Button variant="outline" className="gap-2 btn-glow">
                          <Upload size={16} className="text-primary" />
                          Change Avatar
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" {...field} />
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
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" {...field} />
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
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
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
                  </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield size={18} className="text-primary" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  className="pl-9"
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
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  className="pl-9"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="twoFactorEnabled"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <FormLabel>Two-Factor Authentication</FormLabel>
                              </div>
                              <FormDescription>
                                Add an extra layer of security to your account
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell size={18} className="text-primary" />
                      Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your notification and display settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notificationPreferences.email"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <FormLabel>Email Notifications</FormLabel>
                              </div>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notificationPreferences.push"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-muted-foreground" />
                                <FormLabel>Push Notifications</FormLabel>
                              </div>
                              <FormDescription>
                                Receive push notifications in your browser
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notificationPreferences.desktop"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <FormLabel>Desktop Notifications</FormLabel>
                              </div>
                              <FormDescription>
                                Receive notifications on your desktop
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4 text-muted-foreground" />
                              <FormLabel>Theme Preference</FormLabel>
                            </div>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
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
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="gradient-teal hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
