
"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, LogOut, Newspaper, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const adminBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // Renamed to avoid conflict

// This component will be the shell for authenticated admin pages
function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Using adminBasePath for images specific to this layout
  
  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Admin Area...</p>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    // This will be brief as the useEffect should redirect.
    // It prevents rendering children momentarily before redirect.
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <p className="text-lg">Redirecting to login...</p>
        </div>
    );
  }
  
  // If on login page, and user is already logged in, redirect to a default admin page
  // Or, if on login page and not logged in, render the login page (children)
  if (pathname === '/admin/login') {
    if (user) {
      router.replace('/admin/add-article'); // Default admin page
      return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Redirecting to Admin Dashboard...</p>
        </div>
      );
    }
    return <>{children}</>; // Render login page
  }


  // For authenticated users on admin pages (not /admin/login)
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 bg-card p-6 shadow-lg flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8 text-primary">
            <Image src={`${adminBasePath}/veab-logo.png`} alt="VEAB Logo" width={32} height={32} />
            <span className="text-2xl font-bold">Goa Admin</span>
        </Link>
        <nav className="flex-grow space-y-2">
            <Button variant="ghost" asChild className={cn("w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary", pathname === '/admin/add-article' && "bg-primary/10 text-primary font-semibold")}>
                <Link href="/admin/add-article"><Newspaper size={18} className="mr-2"/> Add Article</Link>
            </Button>
            <Button variant="ghost" asChild className={cn("w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary", pathname === '/admin/add-project' && "bg-primary/10 text-primary font-semibold")}>
                <Link href="/admin/add-project"><Sprout size={18} className="mr-2"/> Add Project</Link>
            </Button>
            {/* Add more admin links here */}
        </nav>
        <Button onClick={logout} variant="outline" className="mt-auto border-destructive text-destructive hover:bg-destructive/10">
            <LogOut size={18} className="mr-2"/> Logout
        </Button>
         <p className="text-xs text-center text-muted-foreground mt-4">Logged in as: {user?.email}</p>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}


// AdminLayout wraps pages under /admin path
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AuthProvider is in the root layout, so useAuth can be called directly in AdminShell.
  return <AdminShell>{children}</AdminShell>;
}

    