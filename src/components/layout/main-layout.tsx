
import type React from 'react';
import Header from './header';
import Footer from './footer';
import { Toaster } from "@/components/ui/toaster"


export default function MainLayout({ children }: { children: React.ReactNode }) {
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
