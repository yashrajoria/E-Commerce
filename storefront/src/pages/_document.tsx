import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Pages Router document: declares the `<html>` shell, favicon, PWA
 * manifest, and shared meta tags for every page.
 *
 * @remarks
 * Server Component — no `"use client"` directive; renders during SSR under the Next.js Pages Router.
 *
 * @example
 * ```tsx
 * // Next.js wraps every route with this document, effectively rendering:
 * <Html lang="en">
 *   <Head>...</Head>
 *   <body>
 *     <Main />
 *     <NextScript />
 *   </body>
 * </Html>
 * ```
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1a1a2e" />

        {/* Apple touch icon */}
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
