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
      { protocol: "http", hostname: "localhost" },
      // Allow images served from localstack (used in local integration tests)
      { protocol: "http", hostname: "localstack", port: "4566" },
      { protocol: "https", hostname: "shopswift.s3.amazonaws.com" },

    ],
  },
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 
      process.env.NEXT_PUBLIC_NEW_API_URL ||
      "http://172.16.14.140:8080";
    return {
      beforeFiles: [
        {
          source: "/bff/:path*",
          destination: "/api/bff/:path*",
        },
      ],
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
