import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@ecommerce/shared"],
  reactStrictMode: true,
  webpack: (config) => {
    // Avoid overriding React resolution here; let Next/npm handle it to prevent
    // potential duplicate or incorrect React instances at build/runtime.
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "tse2.mm.bing.net" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "shopswift.s3.amazonaws.com" },
      { protocol: "https", hostname: "cdn.example.com" },
      { protocol: "https", hostname: "picsum.photos" },

      // Allow images served from localstack (used in local integration tests)
      { protocol: "http", hostname: "localstack", port: "4566" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, ".."),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    // No catch-all `/api/*` → backend fallback. Unmatched routes must 404;
    // explicit pages/api proxies are the only backend entry points.
    return [];
  },
};

export default nextConfig;
