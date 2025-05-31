
"use client"; // Make MainLayout a client component to use usePathname

import type React from 'react';
import Header from './header';
import Footer from './footer';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation'; // Import usePathname

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // For admin routes, we typically don't want the main header/footer
    // The admin layout will provide its own structure.
    // AuthProvider is already in RootLayout, so children will have access.
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // For non-admin routes, render the standard layout
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
