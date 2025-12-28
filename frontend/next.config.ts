import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Add health check endpoint
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health',
      },
    ];
  },
};

export default nextConfig;
