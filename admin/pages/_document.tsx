import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom `_document` shell that renders the `<html>`/`<body>` scaffold, fonts, favicon, and PWA links.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Next.js renders this once per page request, wrapping the app route tree:
 * // <Document /> → <Html lang="en"><Head>…</Head><body><Main /><NextScript /></body></Html>
 * ```
 */
export default function Document() {
  return (
    <Html
      lang="en"
      className="theme-admin scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon-admin.svg" />
        <link rel="shortcut icon" href="/favicon-admin.svg" />

        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />

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
