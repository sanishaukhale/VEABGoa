
"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, LogOut, Newspaper, Sprout, Users } from 'lucide-react'; // Added Users icon
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const adminBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (loading) { // Wait for auth state to resolve before attempting redirects
      return;
    }

    if (!user && pathname !== '/admin/login') {
      // If not logged in and not on the login page, redirect to login
      router.replace('/admin/login');
    } else if (user && pathname === '/admin/login') {
      // If logged in and on the login page, redirect to a default admin page
      router.replace('/admin/add-article'); 
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

  // If user is not logged in and trying to access an admin page (not /admin/login)
  // useEffect will redirect, show a "Redirecting to login..." message during this process.
  if (!user && pathname !== '/admin/login') {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Redirecting to login...</p>
        </div>
    );
  }
  
  // Handles rendering for the /admin/login path or the main admin shell
  if (pathname === '/admin/login') {
    if (user) {
      // User is logged in and on the login page, useEffect will redirect.
      // Show a "Redirecting to Admin Dashboard..." message.
      return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Redirecting to Admin Dashboard...</p>
        </div>
      );
    }
    // User is not logged in and on the login page, render the children (login form).
    return <>{children}</>; 
  }

  // If we reach here, it means:
  // 1. user is logged in (because !user cases are handled above or by useEffect)
  // 2. pathname is not '/admin/login'
  // So, render the full admin shell.
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
            <Button variant="ghost" asChild className={cn("w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary", pathname === '/admin/manage-team' && "bg-primary/10 text-primary font-semibold")}>
                <Link href="/admin/manage-team"><Users size={18} className="mr-2"/> Manage Team</Link>
            </Button>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
