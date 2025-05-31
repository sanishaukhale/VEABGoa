
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact VEAB Goa",
  description: "Get in touch with VEAB Goa. Send us a message through our contact form, find our location, or reach out via email or phone. We are eager to hear from you about volunteering, collaborations, or any queries.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact VEAB Goa - Reach Out for a Greener Goa',
    description: "Connect with VEAB Goa to discuss environmental initiatives, volunteer opportunities, or to ask any questions. Find all our contact details here.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
