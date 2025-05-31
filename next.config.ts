
import dotenv from 'dotenv';
import type {NextConfig} from 'next';

// Load environment variables from src/.env.local
dotenv.config({ path: './src/.env.local' });

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  // IMPORTANT: Replace 'your-repo-name' with your actual GitHub repository name
  // If your site is at https://<username>.github.io/your-repo-name/
  // If your site is at https://<username>.github.io/ (i.e., a user/org page using the <username>.github.io repo),
  // then you can remove basePath or set it to an empty string.
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
