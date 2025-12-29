import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@kuaitu/core'],
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
