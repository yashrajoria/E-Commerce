/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true, // https://github.com/vercel/next.js/issues
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "media.istockphoto.com",
      "cdn.dummyjson.com",
    ],
  },
};

module.exports = nextConfig;
