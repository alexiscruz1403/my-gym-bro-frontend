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
    runtimeCaching: [
      // Cache visited HTML pages with NetworkFirst so they're available offline
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-pages',
          networkTimeoutSeconds: 3,
        },
      },
      // Never cache API routes — stale session data would corrupt the store
      {
        urlPattern: /^https?:\/\/.*\/api\//,
        handler: 'NetworkOnly',
      },
    ],
  },
})(nextConfig);
