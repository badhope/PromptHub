import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === 'development';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const isStandalone = process.env.BUILD_STANDALONE === 'true';

const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev,
  register: true,
});

const nextConfig: NextConfig = {
  output: isDev ? undefined : (isStandalone ? 'standalone' : 'export'),
  basePath: isGitHubPages && !isDev ? '' : '',
  assetPrefix: isGitHubPages && !isDev ? '' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['react-markdown', 'rehype-highlight', 'remark-gfm', 'fuse.js'],
  },
  productionBrowserSourceMaps: false,
  cleanDistDir: true,
};

export default withPWA(nextConfig);
