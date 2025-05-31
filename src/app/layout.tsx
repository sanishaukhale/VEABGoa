
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import MainLayout from '@/components/layout/main-layout';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? `https://sanishaukhale.github.io${basePath}`: `http://localhost:9002${basePath}`),
  title: {
    default: 'VEAB Goa | Environmental Conservation & Wildlife Protection',
    template: '%s | VEAB Goa',
  },
  description: 'Vivekanand Environment Awareness Brigade (VEAB) Goa is a non-profit dedicated to environmental education, wildlife conservation, and promoting a greener Goa.',
  keywords: ['VEAB Goa', 'environment', 'conservation', 'wildlife', 'Goa', 'ngo', 'sustainability', 'Keri', 'Sattari'],
  openGraph: {
    title: 'VEAB Goa | Environmental Conservation & Wildlife Protection',
    description: 'Join VEAB Goa in our mission to protect Goa\'s natural heritage through education, action, and community involvement.',
    url: `https://sanishaukhale.github.io${basePath}`, // Replace with your actual production domain if different
    siteName: 'VEAB Goa',
    images: [
      {
        url: `${basePath}/veab-og-image.png`, // Path to a dedicated OG image in /public
        width: 1200,
        height: 630,
        alt: 'VEAB Goa promoting environmental awareness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEAB Goa | Environmental Conservation & Wildlife Protection',
    description: 'VEAB Goa: Working towards a greener and cleaner Goa. Join us in protecting our natural heritage.',
    // site: '@yourtwitterhandle', // Optional: Add your Twitter handle
    // creator: '@creatorhandle', // Optional: Add content creator's Twitter handle
    images: [`${basePath}/veab-twitter-card.png`], // Path to a dedicated Twitter card image in /public
  },
  icons: {
    icon: `${basePath}/veab-logo.png`, 
    shortcut: `${basePath}/veab-logo.png`,
    apple: `${basePath}/veab-logo.png`,
  },
  // verification: { // Optional: Add verification tags if needed
  //   google: 'YOUR_GOOGLE_SITE_VERIFICATION_TOKEN',
  //   yandex: 'YOUR_YANDEX_VERIFICATION_TOKEN',
  //   other: {
  //     me: ['my-email@example.com', 'my-link'],
  //   },
  // },
  // alternates: { // Optional: If you have canonical URLs or other language versions
  //   canonical: '/',
  //   languages: {
  //     'en-US': '/en-US',
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          {/* MainLayout checks if current route is admin to exclude header/footer */}
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

