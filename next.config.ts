import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://192.168.1.6:3000'],
  images: {
    // domains: ['hjlenhletxsqwiiqxbti.supabase.co'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phnxzjmjiigzudrdxfmi.supabase.co', // production
        // hostname: 'hjlenhletxsqwiiqxbti.supabase.co', // development
        pathname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
