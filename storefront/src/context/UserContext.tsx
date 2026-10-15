import React from "react";
import { AuthProvider, useAuth as useSharedAuth } from "@ecommerce/shared";

/**
 * Props accepted by {@link UserProvider}.
 */
interface UserProviderProps {
  /** Storefront subtree that should have access to the auth context. */
  children: React.ReactNode;
}

/**
 * Provides authentication state to the storefront by wrapping the shared
 * `@ecommerce/shared` `AuthProvider`.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * // Mounted once in the Pages Router app shell (src/pages/_app.tsx).
 * <UserProvider>
 *   <Component {...pageProps} />
 * </UserProvider>
 * ```
 */
export function UserProvider({ children }: UserProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

/**
 * Reads the current authentication state from the user context.
 *
 * @returns An object with `user` (profile or `null`), `loading`, `isAuthenticated`, `refetchUser`, and `signOut`.
 * @throws {@link Error} When called outside a `UserProvider` (the shared `AuthProvider` context is missing).
 */
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
