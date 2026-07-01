import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable detailed build output for CI debugging
  logging: {
    fetches: { fullUrl: true },
  },
  // Ensure consistent response headers
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
