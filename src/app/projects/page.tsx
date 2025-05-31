
import { Sprout, Hourglass } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Conservation Projects",
  description: "Explore VEAB Goa's conservation projects aimed at protecting and preserving Goa's unique environment. Details on our initiatives coming soon!",
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'VEAB Goa Conservation Projects - Protecting Goa\'s Environment',
    description: "Learn about the various environmental conservation projects undertaken by VEAB Goa. Discover how we are making a difference.",
  },
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Sprout size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Our Conservation Projects</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Discover the initiatives we are undertaking to protect and preserve Goa&apos;s environment.
        </p>
      </header>

      <div className="flex flex-col items-center justify-center text-center py-20">
        <Hourglass size={64} className="mx-auto text-accent mb-6" />
        <h2 className="text-3xl font-semibold text-primary mb-3">Coming Soon!</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          We&apos;re working hard to bring you exciting updates on our projects. Please check back later!
        </p>
      </div>
    </div>
  );
}
