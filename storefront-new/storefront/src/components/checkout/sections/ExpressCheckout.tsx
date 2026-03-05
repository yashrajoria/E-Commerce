import { motion } from "framer-motion";

export function ExpressCheckout() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
      aria-label="Express checkout"
    >
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-4">
          Express Checkout
        </h2>
        <div className="flex gap-3">
          <button
            className="flex-1 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            aria-label="Pay with Apple Pay"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C4.24 16.7 4.89 10.5 8.6 10.3c1.24.06 2.1.72 2.82.76.96-.2 1.88-.9 2.93-.82 1.26.1 2.2.62 2.82 1.56-2.58 1.56-1.97 4.98.37 5.93-.47 1.2-.86 2.02-1.49 2.55ZM12.06 10.24c-.12-2.16 1.62-3.96 3.6-4.12.24 2.36-2.16 4.2-3.6 4.12z" />
            </svg>
            Apple Pay
          </button>
          <button
            className="flex-1 h-12 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all"
            aria-label="Pay with Google Pay"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google Pay
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-neutral-900 px-4 text-sm text-neutral-500 dark:text-neutral-400">
              or continue with details below
            </span>
          </div>
        </div>

        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">
          Your payment information is always encrypted &amp; secure
        </p>
      </div>
    </motion.section>
  );
}
