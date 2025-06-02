
import type {NextConfig} from 'next';

// Environment variables will now be loaded by Next.js automatically
// from .env.local in the project root.
// The explicit dotenv.config call has been removed.

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  basePath: process.env.NODE_ENV === 'production' ? '/VEABGoa' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for next export with GitHub Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
