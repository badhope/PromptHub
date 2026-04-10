import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === 'development';

const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev,
  register: true,
});

const nextConfig: NextConfig = {
  output: isDev ? undefined : 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {},
  experimental: {
    optimizePackageImports: ['react-markdown', 'rehype-highlight', 'remark-gfm', 'fuse.js'],
  },
};

export default withPWA(nextConfig);
