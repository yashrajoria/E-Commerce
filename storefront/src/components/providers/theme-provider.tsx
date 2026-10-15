"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * Provides next-themes theming context to the storefront.
 *
 * @remarks
 * Client Component — declares `"use client"`. Thin wrapper around next-themes' `ThemeProvider` that forwards every
 * {@link ThemeProviderProps} option and renders `children` inside it.
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
 *   <CartProvider>{children}</CartProvider>
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
