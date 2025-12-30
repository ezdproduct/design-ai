import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@kuaitu/core'],
  typescript: {
    // Ignore build errors from @kuaitu/core package
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': path.join(__dirname, 'src'),
    },
  },
};

export default nextConfig;
