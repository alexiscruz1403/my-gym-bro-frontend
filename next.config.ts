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
  output: 'standalone',

  // El server.js del modo standalone NO lee este archivo: lleva la config
  // serializada como literal JSON (__NEXT_PRIVATE_STANDALONE_CONFIG), y
  // next.config.ts ni siquiera existe dentro de la imagen. Pero el tracer de Next
  // si lo sigue en build, y arrastra typescript (por ser .ts) y webpack + workbox
  // (por next-pwa) al runtime, donde no se ejecutan nunca. Son ~20 MB.
  outputFileTracingExcludes: {
    '*': [
      'node_modules/typescript/**',
      'node_modules/webpack/**',
      'node_modules/terser/**',
      'node_modules/@ducanh2912/**',
      'node_modules/workbox-*/**',
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
