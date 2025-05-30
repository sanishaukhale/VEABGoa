
"use client";

import Link from "next/link";
import Image from "next/image"; // Added Image import
import { useState, useEffect } from "react";
import { Menu, Home, Info, Sprout, CalendarDays, Newspaper, Mail } from "lucide-react"; // Removed Leaf and X as X is not used
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/projects", label: "Projects", icon: Sprout },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/news", label: "News & Blog", icon: Newspaper },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Image src="/veab-logo.png" alt="VEAB Logo" width={32} height={32} />
          <span className="text-2xl font-bold">Goa</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2 lg:space-x-4">
          {navLinks.map((link) => (
            <Button key={link.label} variant="ghost" asChild
              className={cn(
                "text-foreground hover:bg-accent/10 hover:text-accent",
                pathname === link.href && "text-primary font-semibold bg-primary/10"
              )}
            >
              <Link href={link.href} className="flex items-center gap-1.5">
                <link.icon size={16} />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                   <Link href="/" className="flex items-center gap-2 text-primary">
                    <Image src="/veab-logo.png" alt="VEAB Logo" width={28} height={28} />
                    <span className="text-xl font-bold">Goa</span>
                  </Link>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                  {navLinks.map((link) => (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-md text-foreground hover:bg-accent/10 hover:text-accent transition-colors w-full",
                          pathname === link.href && "text-primary font-semibold bg-primary/10"
                        )}
                      >
                        <link.icon size={20} />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                {/* Removed Donate button from mobile menu footer */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
