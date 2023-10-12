/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true, // https://github.com/vercel/next.js/issues
  },
};

module.exports = nextConfig;
