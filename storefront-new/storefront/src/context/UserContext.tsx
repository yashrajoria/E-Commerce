import React from "react";
import { AuthProvider, useAuth as useSharedAuth } from "@ecommerce/shared";

export function UserProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function useUser() {
  const ctx = useSharedAuth();
  const isAuthenticated = ctx.authenticated;
  const signOut = ctx.logout;

  return {
    user: ctx.user,
    loading: ctx.loading,
    isAuthenticated,
    refetchUser: ctx.refetchUser,
    signOut,
  } as const;
}
