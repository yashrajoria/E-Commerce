import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="theme-admin scroll-smooth">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon-admin.svg" />
        <link rel="shortcut icon" href="/favicon-admin.svg" />
        
        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0a0a0b" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/favicon-admin.svg" />
      </Head>
      <body className="antialiased theme-admin bg-background text-foreground selection:bg-primary/30">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
