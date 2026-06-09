import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Brotli/Gzip compression for smaller payload sizes
  compress: true,

  // 2. Package import optimization for automatic tree-shaking and faster build times
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 3. Custom headers for performance and browser security caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
