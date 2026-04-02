import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/mobile-skills' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mobile-skills' : '',
};

export default nextConfig;
