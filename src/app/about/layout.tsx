
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About VEAB Goa",
  description: "Learn about VEAB Goa's mission, vision, history, and the dedicated team working towards environmental conservation and wildlife protection in Keri, Sattari, Goa.",
  alternates: {
    canonical: '/about',
  },
   openGraph: {
    title: 'About VEAB Goa - Our Mission, Vision, and Team',
    description: "Discover the story behind VEAB Goa, our conservation goals, and meet the passionate individuals driving our efforts in Goa.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
