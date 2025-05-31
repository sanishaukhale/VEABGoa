
import { Newspaper, Hourglass } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "News & Blog",
  description: "Read the latest news, articles, and blog posts from VEAB Goa. Stay informed about our activities, environmental insights, and conservation stories. Fresh content coming soon!",
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'VEAB Goa News & Blog - Latest Updates and Insights',
    description: "Keep up with VEAB Goa's activities, environmental news, and conservation stories on our blog. New articles posted regularly.",
  },
};


export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Newspaper size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">News & Blog</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Stay updated with our latest activities, insights, and environmental news.
        </p>
      </header>

      <div className="flex flex-col items-center justify-center text-center py-20">
        <Hourglass size={64} className="mx-auto text-accent mb-6" />
        <h2 className="text-3xl font-semibold text-primary mb-3">Coming Soon!</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          We are preparing fresh content for our News & Blog. Please check back soon!
        </p>
      </div>
    </div>
  );
}
