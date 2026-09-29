import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "http", hostname: "localhost" },
      // Allow images served from localstack (used in local integration tests)
      { protocol: "http", hostname: "localstack", port: "4566" },
      { protocol: "https", hostname: "shopswift.s3.amazonaws.com" },
      { protocol: "https", hostname: "picsum.photos" },

    ],
  },
  async rewrites() {
    // Canonical env is NEXT_PUBLIC_NEW_API_URL; keep NEXT_PUBLIC_API_BASE_URL
    // as a backwards-compatible alias. Trim trailing slashes for safe joins.
    const rawBase =
      process.env.NEXT_PUBLIC_NEW_API_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:8080";
    const apiBaseUrl = rawBase.replace(/\/+$/, "");
    // NOTE: do NOT rewrite /api/:path* — that would shadow pages/api/* proxies.
    // Use /bff/:path* for BFF and /backend/:path* for direct backend access.
    return [
      {
        source: "/bff/:path*",
        destination: `${apiBaseUrl}/bff/:path*`,
      },
      {
        source: "/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
