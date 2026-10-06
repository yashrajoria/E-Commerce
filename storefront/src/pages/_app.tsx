import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { setAPIErrorHandler } from "@ecommerce/shared";
import { toast as sharedToast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
          },
        },
      }),
  );

  useEffect(() => {
    setAPIErrorHandler((type, message) => {
      sharedToast.error(message);
    });
  }, []);

  return (
    <>
      <Head>
        <title>ShopSwift</title>
        <meta
          name="description"
          content="Shop top products with fast delivery, secure checkout, and great prices."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="ShopSwift" />
        <meta
          property="og:description"
          content="Shop top products with fast delivery, secure checkout, and great prices."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/api/og" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/api/og" />
      </Head>
      {/* <html lang="en" suppressHydrationWarning> */}
      <div className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <Toaster />
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                </QueryClientProvider>
                <Analytics />
                <SpeedInsights />
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ThemeProvider>
      </div>

      {/* </html> */}
    </>
  );
}
