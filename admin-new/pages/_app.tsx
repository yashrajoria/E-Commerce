import "../styles/globals.css";
import "../styles/app.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Premium error fallback with glassmorphism styling */
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
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
          {error.message}
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

/** Top loading bar for route transitions */
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

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouteProgressBar />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "glass-effect-strong border border-white/[0.08] text-foreground",
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
    </ErrorBoundary>
  );
}
