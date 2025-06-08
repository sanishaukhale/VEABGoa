
import type {NextConfig} from 'next';

// Environment variables will now be loaded by Next.js automatically
// from .env.local in the project root.

const nextConfig: NextConfig = {
  // output: 'export', // REMOVED for serverful deployment (e.g., Firebase App Hosting)
  basePath: '', // Set to empty for Firebase App Hosting
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false, // Set to false to enable Next.js image optimization on App Hosting
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
