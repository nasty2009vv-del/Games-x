import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external preview connection for Next.js dev server
  allowedDevOrigins: ['172.28.112.1', 'localhost', '127.0.0.1'],
};

export default nextConfig;
