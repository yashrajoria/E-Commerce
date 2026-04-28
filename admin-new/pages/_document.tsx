import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="theme-storefront">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon-admin.svg" />
        <link rel="shortcut icon" href="/favicon-admin.svg" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1a1a2e" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/favicon-admin.svg" />
      </Head>
      <body className="antialiased theme-storefront">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
