import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['axios'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://keyword-finder-backend-production.up.railway.app/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://keyword-finder-backend-production.up.railway.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
