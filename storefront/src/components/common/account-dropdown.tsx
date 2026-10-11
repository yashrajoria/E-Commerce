"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { trapFocus } from "@/lib/utils";
import {
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/router";

type AccountUser = {
  name?: string;
  email?: string;
  avatar?: string;
  created_at?: string;
  wishlist?: unknown[];
  wishlists?: unknown[];
  orders?: { meta?: { total_orders?: number } };
  profile?: {
    name?: string;
    email?: string;
    avatar?: string;
    created_at?: string;
  };
};

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    prevFocused.current = document.activeElement as HTMLElement;
    setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(panelRef.current, e);
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      prevFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  const reduceMotion = useReducedMotion();
  const { user, signOut } = useUser();
  const router = useRouter();
  const { wishlist: localWishlist } = useWishlist();

  const getInitials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n.charAt(0))
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U";

  const safeUser = user as AccountUser | null;

  const getProp = <T,>(obj: unknown, ...keys: string[]): T | undefined => {
    let cur: unknown = obj;
    for (const k of keys) {
      if (!cur || typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[k];
    }
    return cur as T | undefined;
  };

  const displayName = getProp<string>(safeUser, "name") || getProp<string>(safeUser, "profile", "name") || "";
  const avatarUrl = getProp<string>(safeUser, "avatar") || getProp<string>(safeUser, "profile", "avatar") || "";
  const userOrdersCount = Number(getProp<number>(safeUser, "orders", "meta", "total_orders") ?? 0);
  const userWishlistCount = Number(getProp<number[]>(safeUser, "wishlist")?.length ?? getProp<number[]>(safeUser, "wishlists")?.length ?? localWishlist?.length ?? 0);

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      description: "Manage personal information",
      icon: User,
      badge: null,
      action: () => {
        router.push("/account?tab=profile");
        onClose();
      },
    },
    {
      id: "orders",
      label: "Orders",
      description: "Track and review past orders",
      icon: Package,
      badge: userOrdersCount ? `${userOrdersCount}` : null,
      action: () => {
        router.push("/account?tab=orders");
        onClose();
      },
    },
    {
      id: "wishlist",
      label: "Wishlist",
      description: "Saved items",
      icon: Heart,
      badge: userWishlistCount ? `${userWishlistCount}` : null,
      action: () => {
        router.push("/account?tab=wishlist");
        onClose();
      },
    },
    {
      id: "addresses",
      label: "Addresses",
      description: "Delivery and billing",
      icon: MapPin,
      badge: null,
      action: () => {
        router.push("/account?tab=addresses");
        onClose();
      },
    },
    {
      id: "payment",
      label: "Payment Methods",
      description: "Saved payment cards",
      icon: CreditCard,
      badge: null,
      action: () => {
        router.push("/account?tab=payment");
        onClose();
      },
    },
    {
      id: "settings",
      label: "Settings",
      description: "Preferences and security",
      icon: Settings,
      badge: null,
      action: () => {
        router.push("/account?tab=settings");
        onClose();
      },
    },
  ];

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    router.push("/");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Dropdown Container */}
          <motion.div
            ref={panelRef}
            className="absolute top-full right-0 mt-2 w-80 z-50 origin-top-right"
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="bg-card text-card-foreground rounded-xl border border-border shadow-lg overflow-hidden">
              {/* User Header */}
              <div className="p-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 rounded-lg border border-border">
                    <AvatarImage
                      src={avatarUrl || "/placeholder-avatar.jpg"}
                      alt={displayName || "User"}
                    />
                    <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                      {getInitials(displayName || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {displayName || "Customer Account"}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/40">
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/40 text-center">
                    <div className="text-sm font-bold text-foreground">{userOrdersCount}</div>
                    <div className="text-[11px] text-muted-foreground">Orders</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40 border border-border/40 text-center">
                    <div className="text-sm font-bold text-foreground">{userWishlistCount}</div>
                    <div className="text-[11px] text-muted-foreground">Wishlist</div>
                  </div>
                </div>
              </div>

              {/* Menu List */}
              <div className="p-1.5 space-y-0.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </div>
                  </button>
                ))}
              </div>

              <Separator className="my-1" />

              {/* Footer */}
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
