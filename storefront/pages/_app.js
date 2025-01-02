import { CartContextProvider } from "@/components/CartContext";
import { Helmet } from "react-helmet";
import { createGlobalStyle } from "styled-components";
import { HydrationProvider } from "react-hydration-provider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const GlobalStyles = createGlobalStyle`
  body {

    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <HydrationProvider>
          <GlobalStyles />
          <Toaster />

          <CartContextProvider>
            <Helmet>
              <link
                href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
                rel="stylesheet"
              />
            </Helmet>
            {/* <div className="min-h-screen p-4"> */}
            <Component {...pageProps} />
            {/* </div> */}
          </CartContextProvider>
        </HydrationProvider>
      </SessionProvider>
    </>
  );
}
