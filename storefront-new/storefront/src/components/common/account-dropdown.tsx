/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/lib/user";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Crown,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  // setLoggedIn: (value: boolean) => void;
}

export function AccountDropdown({
  isOpen,
  onClose,
}: // setLoggedIn,
AccountDropdownProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user, signOut } = useUser();
  console.log(user);
  const getInitials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "";
  const displayName = (user as any)?.name || (user as any)?.profile?.name || "";
  const avatarUrl =
    (user as any)?.avatar || (user as any)?.profile?.avatar || "";
  const { wishlist: localWishlist } = useWishlist();

  const userOrdersCount = (user as any)?.orders?.meta?.total_orders ?? 0;
  const userWishlistCount =
    (user as any)?.wishlist?.length ??
    (user as any)?.wishlists?.length ??
    localWishlist?.length ??
    0;

  const accountStats = [
    {
      label: "Orders",
      value: String(userOrdersCount),
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Wishlist",
      value: String(userWishlistCount),
      icon: Heart,
      color: "from-pink-500 to-pink-600",
    },
  ];

  const router = useRouter();

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      description: "Manage your personal information",
      icon: User,
      badge: null,
      action: () => router.push("/account/?tab=profile"),
    },
    {
      id: "orders",
      label: "Order History",
      description: "Track and manage your orders",
      icon: Package,
      badge: userOrdersCount ? `${userOrdersCount} Orders` : null,
      action: () => router.push("/account/?tab=orders"),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      badge: userWishlistCount ? `${userWishlistCount} Items` : null,
      action: () => router.push("/account/?tab=wishlist"),
    },
    {
      id: "addresses",
      label: "Addresses",
      description: "Manage delivery addresses",
      icon: MapPin,
      badge: null,
      action: () => router.push("/account/?tab=addresses"),
    },
    {
      id: "payment",
      label: "Payment Methods",
      description: "Cards and payment options",
      icon: CreditCard,
      badge: null,
      action: () => router.push("/account/?tab=payment"),
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Manage your preferences",
      icon: Bell,
      badge: null,
      action: () => router.push("/account/?tab=settings"),
    },
    {
      id: "settings",
      label: "Settings",
      description: "Account and privacy settings",
      icon: Settings,
      badge: null,
      action: () => router.push("/account/?tab=settings"),
    },
  ];

  const handleLogout = async () => {
    await logoutUser();
    // setLoggedIn(false);
    if (signOut) {
      signOut();
    }

    router.push("/");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            className="absolute top-full right-0 mt-2 w-96 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Gradient Background (match Account header: rose -> amber) */}
              <div className="absolute inset-0 bg-linear-to-br from-rose-600/5 via-rose-600/5 to-amber-500/5 pointer-events-none" />

              {/* Header Section */}
              <div className="relative p-6 border-b border-border/50">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={avatarUrl || "/placeholder-avatar.jpg"}
                        alt="User"
                      />
                      <AvatarFallback className="bg-linear-to-r from-rose-600 to-amber-500 text-white font-semibold text-lg">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-rose-600 transition-all duration-300" />
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-5 h-5 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {displayName || user?.email || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-linear-to-r from-rose-600/20 to-amber-500/20 text-rose-700 dark:text-amber-300"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Premium Member
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {accountStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-muted/30 border border-border/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-linear-to-r ${stat.color} flex items-center justify-center`}
                      >
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-4 h-auto text-left rounded-xl transition-all duration-200 ${
                        hoveredItem === item.id
                          ? "bg-linear-to-r from-rose-600/10 to-amber-500/10 border border-rose-600/20"
                          : "hover:bg-muted/50"
                      }`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={item.action}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              hoveredItem === item.id
                                ? "bg-linear-to-r from-rose-600 to-amber-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                              hoveredItem === item.id ? "translate-x-1" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-2" />

              {/* Footer Actions */}
              <div className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Member Since{" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
