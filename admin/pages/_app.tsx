import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster, toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { setAPIErrorHandler, setAuthRefreshUrl } from "@ecommerce/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ContextualAIAssistant } from "@/components/ai/ContextualAIAssistant";
import { resolveAIPageContext } from "@/lib/ai-contextual-assistant";
import { AdminSessionProvider, useAdminSession } from "@/lib/useAdminSession";
import { StoreProvider } from "@/lib/useStore";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";

// Admin JWT refresh must not hit storefront `/api/user/auth/refresh`.
setAuthRefreshUrl("/api/admin/auth/refresh");

/** Props accepted by {@link ErrorFallback}. */
interface ErrorFallbackProps {
  /** The error thrown by the failed subtree, rendered as its message. */
  error: unknown; // Change the type to match FallbackProps
  /** Resets the boundary's error state so the subtree can render again. */
  resetErrorBoundary: () => void;
}

/**
 * Renders the glassmorphism error card used as the {@link ErrorBoundary} fallback when a page throws.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <ErrorBoundary FallbackComponent={ErrorFallback}>
 *   <Component {...pageProps} />
 * </ErrorBoundary>
 * ```
 */
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const errorMessage = (error as Error).message; // Explicitly cast error to Error
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass-effect-strong rounded-2xl p-8 max-w-md w-full text-center border-gradient">
        <div className="w-14 h-14 rounded-xl gradient-rose flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground mb-4 break-words">
          {errorMessage}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-5 py-2 rounded-xl gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * Renders a gradient progress bar pinned to the top of the viewport while a Pages Router route transition is in flight.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @example
 * ```tsx
 * <RouteProgressBar />
 * ```
 */
function RouteProgressBar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.3 } }}
        >
          <motion.div
            className="h-full gradient-purple"
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            exit={{ width: "100%" }}
            transition={{
              width: { duration: 8, ease: "easeOut" },
            }}
          />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/50 to-transparent animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Applies the admin auth gate and shell (theme, toaster, progress, AI assistant) around the active page.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration. Redirects unauthenticated visitors of `/products`, `/orders`, `/dashboard`, and the other protected prefixes to `/?error=admin_required` once {@link useAdminSession} finishes loading.
 *
 * @param Component - The active Pages Router page component for the current route.
 * @param pageProps - Props returned by the page's data-fetching function (for example `getServerSideProps`).
 * @param router - The Next.js router instance for the current route.
 * @returns The themed admin shell with the rendered page, or a full-screen {@link LoadingSpinner} while the session check is pending or rejected.
 */
function AppContent({ Component, pageProps, router }: AppProps) {
  const { loading, authenticated, isAdmin } = useAdminSession();

  // pages/prefixes that should require an authenticated admin session
  const protectedPrefixes = [
    "/products",
    "/orders",
    "/dashboard",
    "/customers",
    "/settings",
    "/inventory",
    "/returns",
    "/reviews",
    "/profile",
    "/analytics",
    "/marketing",
    "/support",
    "/shipping",
    "/categories",
    "/activity-logs",
  ];

  const needsAuth = protectedPrefixes.some((p) => router.asPath.startsWith(p));
  const surfaceTheme = "theme-admin";
  const pageAIContext = useMemo(
    () =>
      resolveAIPageContext({
        pathname: router.pathname,
        asPath: router.asPath,
        query: router.query,
      }),
    [router.asPath, router.pathname, router.query],
  );
  const shouldRenderContextualAssistant =
    needsAuth &&
    authenticated &&
    isAdmin &&
    router.pathname !== "/dashboard/ai-insights" &&
    Boolean(pageAIContext);

  useEffect(() => {
    setAPIErrorHandler((type, message) => {
      if (type === "FORBIDDEN") {
        toast.error(message);
      } else if (type === "RATE_LIMITED") {
        toast.error(message);
      } else if (type === "SERVER_ERROR") {
        toast.error(message);
      }
    });

    const handleLogout = () => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove(
      "theme-admin",
      "theme-storefront",
    );
    document.body.classList.remove("theme-admin", "theme-storefront");
    document.documentElement.classList.add(surfaceTheme);
    document.body.classList.add(surfaceTheme);

    return () => {
      document.documentElement.classList.remove(
        "theme-admin",
        "theme-storefront",
      );
      document.body.classList.remove("theme-admin", "theme-storefront");
    };
  }, [surfaceTheme]);

  useEffect(() => {
    if (!loading && needsAuth && (!authenticated || !isAdmin)) {
      router.replace("/?error=admin_required");
    }
  }, [loading, authenticated, isAdmin, needsAuth, router]);

  if (needsAuth && loading) {
    return (
      <div
        className={`${surfaceTheme} min-h-screen flex items-center justify-center`}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (needsAuth && (!authenticated || !isAdmin)) {
    return (
      <div
        className={`${surfaceTheme} min-h-screen flex items-center justify-center`}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={surfaceTheme}>
        <RouteProgressBar />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "glass-effect-strong border border-border text-foreground shadow-md",
            duration: 4000,
          }}
          closeButton
          richColors
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={router.asPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
        {shouldRenderContextualAssistant && pageAIContext ? (
          <ContextualAIAssistant context={pageAIContext} />
        ) : null}
        <Analytics />
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  );
}

/**
 * Root admin `_app` component that wraps every route with the theme, admin session, and store providers.
 *
 * @remarks
 * Client Component — no `"use client"` directive (Next.js Pages Router); relies on client-side state/effects, so it runs in the browser after hydration.
 *
 * @param props - The standard Pages Router app props (`Component`, `pageProps`, `router`) forwarded to {@link AppContent}.
 * @returns The provider stack rendering the active page.
 *
 * @example
 * ```tsx
 * // Next.js mounts <App /> around every admin route:
 * // <App Component={DashboardPage} pageProps={{ … }} router={router} />
 * ```
 */
export default function App(props: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AdminSessionProvider>
        <StoreProvider>
          <AppContent {...props} />
        </StoreProvider>
      </AdminSessionProvider>
    </ThemeProvider>
  );
}
