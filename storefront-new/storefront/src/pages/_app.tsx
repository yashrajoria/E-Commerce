import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Storefront</title>
        <meta
          name="description"
          content="Shop top products with fast delivery, secure checkout, and great prices."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Storefront" />
        <meta
          property="og:description"
          content="Shop top products with fast delivery, secure checkout, and great prices."
        />
        <meta property="og:type" content="website" />
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
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ThemeProvider>
      </div>

      {/* </html> */}
    </>
  );
}
