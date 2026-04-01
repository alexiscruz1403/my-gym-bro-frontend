import type { NextConfig } from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    // Never cache API routes — session data from cache would corrupt the store
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/.*\/api\//,
        handler: 'NetworkOnly',
      },
    ],
  },
})(nextConfig);
