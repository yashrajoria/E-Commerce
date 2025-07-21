import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Metadata } from "next/types";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SuperStore - Everything You Need in One Place",
  description:
    "Discover millions of products from trusted brands. Fast delivery, secure payments, and unbeatable prices.",
};
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <html lang="en" suppressHydrationWarning> */}
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </body>
      {/* </html> */}
    </>
  );
}
