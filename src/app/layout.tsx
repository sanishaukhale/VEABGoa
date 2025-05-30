
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import MainLayout from '@/components/layout/main-layout';

// By importing GeistSans and GeistMono, their CSS variables (e.g., --font-geist-sans)
// are made available when we apply GeistSans.variable and GeistMono.variable in the className.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'VEAB Goa',
  description: 'Working towards a greener and cleaner Goa. Join VEAB Goa in protecting our natural heritage.',
  icons: {
    icon: `${basePath}/veab-logo.png`, // Path relative to the public folder, considering basePath
    shortcut: `${basePath}/veab-logo.png`,
    apple: `${basePath}/veab-logo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        Applying GeistSans.variable and GeistMono.variable here makes the CSS variables
        --font-geist-sans and --font-geist-mono available globally.
        The globals.css file already uses var(--font-geist-sans).
      */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
