import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://192.168.1.6:3000'],
  images: {
    domains: ['hjlenhletxsqwiiqxbti.supabase.co'],
  },
};

export default nextConfig;
