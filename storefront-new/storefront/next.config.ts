import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@ecommerce/shared'],
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

      // Allow images served from localstack (used in local integration tests)
      { protocol: "http", hostname: "localstack", port: "4566" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "..", ".."),
  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://172.16.13.94:8080";
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${apiBaseUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
