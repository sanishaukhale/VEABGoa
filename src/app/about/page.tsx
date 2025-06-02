
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Target, BookOpen, CheckCircle, Linkedin, Twitter, Mail as MailIcon } from "lucide-react";
import { useState } from "react";
import type { Metadata } from 'next'; // Only for type, metadata object needs to be exported

// Cannot export metadata from client component, so this is just for potential future server component refactor.
// Actual metadata for this page should be in a server component or layout segment.
// For now, let's assume a default metadata object or it's handled by a higher layout.
// To set metadata for `/about`, we'd ideally make this a server component or use a route group layout.
// As a workaround for client components, metadata is often set in the nearest server `layout.tsx` or `page.tsx`
// If this page itself were a server component, you could export:
/*
export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about VEAB Goa's mission, vision, history, and the dedicated team working towards environmental conservation and wildlife protection in Keri, Sattari, Goa.",
};
*/


interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  dataAiHint?: string; // Make optional as we are removing it for updated images
  intro: string;
  profession: string;
  socials?: SocialLink[];
}

export default function AboutPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const teamMembers: TeamMember[] = [
    {
      name: "Chandrakant Shinde",
      role: "President",
      imageUrl: "/chandrakant_shinde.png", 
      intro: "Leading VEAB with a dedicated vision for Goa's environmental conservation and community engagement.",
      profession: "Environmental Leader",
      socials: [
        { platform: "LinkedIn", url: "#", icon: Linkedin },
        { platform: "Mail", url: "mailto:president@example.com", icon: MailIcon },
      ],
    },
    {
      name: "Sangam Patil",
      role: "Vice President",
      imageUrl: "/sangam_patil.jpg",
      dataAiHint: "person smiling",
      intro: "Supporting strategic initiatives and fostering partnerships for sustainable development in the region.",
      profession: "Conservation Strategist",
      socials: [{ platform: "Twitter", url: "#", icon: Twitter }],
    },
    {
      name: "Deepak Gawas",
      role: "Secretary",
      imageUrl: "/deepak_gawas.png",
      dataAiHint: "professional headshot",
      intro: "Overseeing administrative operations and ensuring smooth execution of VEAB's projects and programs.",
      profession: "Operations Manager",
      socials: [{ platform: "Mail", url: "mailto:secretary@example.com", icon: MailIcon }],
    },
    {
      name: "Ramesh Zarmekar",
      role: "Treasurer",
      imageUrl: "/ramesh_zarmekar.png",
      dataAiHint: "person portrait",
      intro: "Managing financial resources with transparency to support VEAB's mission and long-term sustainability.",
      profession: "Financial Advisor",
    },
    {
      name: "Sanket Naik",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png",
      dataAiHint: "team member",
      intro: "Contributing to ecological research and on-ground conservation activities with expertise.",
      profession: "Field Biologist",
    },
    {
      name: "Subodh Naik",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png",
      dataAiHint: "professional photo",
      intro: "Actively involved in community outreach and environmental awareness campaigns across Goa.",
      profession: "Community Organizer",
    },
    {
      name: "Vitthal Shelke",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png",
      dataAiHint: "person smiling",
      intro: "Focused on wildlife rescue operations and habitat restoration projects within the state.",
      profession: "Wildlife Rehabilitator",
    },
    {
      name: "Suryakant Gaonkar",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png",
      dataAiHint: "professional headshot",
      intro: "Dedicated to promoting sustainable agricultural practices and local biodiversity.",
      profession: "Agroecologist",
    },
    {
      name: "Gajanan Shetye",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png",
      dataAiHint: "team member",
      intro: "Advocating for policy changes and legal frameworks for better environmental protection.",
      profession: "Environmental Advocate",
    },
  ];

  const missionPoints = [
    "Protecting & improving the natural environment.",
    "Spreading awareness and knowledge on the principles, practices regarding wildlife protection, pollution control and conservation of natural resources.",
    "Facilitating action to maintain the stock of biological wealth.",
    "To carry out environmental education and reach to a maximum people.",
    "To rescue, treat & rehabilitate wild animals.",
    "To implement conservation projects, coordinate related activities and spread awareness regarding the same.",
    "To carry out research & documentation on wildlife and other facets of biodiversity."
  ];

  const handleFlip = (name: string) => {
    setFlippedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Leaf size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About VEAB Goa</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Vivekanand Environment Awareness Brigade (VEAB) is a non-profit organization based in Keri- Sattari- Goa, dedicated towards environment education & wildlife conservation.
        </p>
      </header>

      <section className="mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <BookOpen size={32} className="text-accent mr-3" />
              <CardTitle className="text-3xl text-accent">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground space-y-4">
            <p>
              Founded in 2010 by a group of passionate environmentalists and local community leaders, VEAB Goa emerged from a shared concern for the rapidly changing Goan landscape. Witnessing the pressures of unplanned development, resource depletion, and climate change on our pristine ecosystems, we felt an urgent call to action.
            </p>
            <p>
              Over the past decade, VEAB Goa has grown from a small volunteer group into a recognized organization at the forefront of environmental conservation in the region. Our journey has been marked by successful grassroots campaigns, impactful research projects, and a growing network of dedicated volunteers and partners. We believe in a collaborative approach, working closely with local communities, government bodies, and academic institutions to create lasting positive change.
            </p>
             <Image src="/veab-our-story.jpg" alt="VEAB Goa team collaborating on environmental projects" width={800} height={400} className="rounded-lg mt-6" />
          </CardContent>
        </Card>
      </section>

      <section className="mb-16 grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex items-center mb-2">
                <Target size={32} className="text-accent mr-3" />
                <CardTitle className="text-3xl text-accent">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground">
            <ul className="space-y-3">
              {missionPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
                <Leaf size={32} className="text-accent mr-3" />
                <CardTitle className="text-3xl text-accent">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground">
            <p>
              We envision a Goa where human development and environmental preservation coexist harmoniously. A future where our rich biodiversity thrives, our natural resources are managed sustainably, and communities are environmentally conscious and resilient.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="text-center mb-10">
          <Users size={48} className="mx-auto text-primary mb-3" />
          <h2 className="text-3xl md:text-4xl font-semibold text-primary">Meet Our Team</h2>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flip-card h-96" onClick={() => handleFlip(member.name)}>
              <div className={`flip-card-inner ${flippedCards[member.name] ? 'is-flipped' : ''}`}>
                <div className="flip-card-front">
                  <Card className="w-full h-full flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="pt-6 flex flex-col items-center justify-center flex-grow">
                      <Image
                        src={member.imageUrl}
                        alt={`Portrait of ${member.name}, ${member.role}`}
                        width={150}
                        height={150}
                        className="rounded-full mx-auto mb-4 border-4 border-primary/40"
                        // Conditional data-ai-hint if it exists
                        {...(member.dataAiHint && { 'data-ai-hint': member.dataAiHint })}
                      />
                      <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                      <p className="text-accent">{member.role}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flip-card-back">
                  <Card className="w-full h-full flex flex-col shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-primary">{member.name}</CardTitle>
                      <p className="text-sm text-accent -mt-1">{member.role}</p>
                    </CardHeader>
                    <CardContent className="pt-2 text-left space-y-3 overflow-y-auto flex-grow">
                      <div>
                        <h4 className="font-semibold text-accent/90 text-sm">About</h4>
                        <p className="text-xs sm:text-sm text-foreground">{member.intro}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent/90 text-sm">Profession</h4>
                        <p className="text-xs sm:text-sm text-foreground">{member.profession}</p>
                      </div>
                      {member.socials && member.socials.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-accent/90 text-sm">Connect</h4>
                          <div className="flex space-x-3 mt-1">
                            {member.socials.map(social => (
                              <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/70"
                                onClick={(e) => e.stopPropagation()} // Prevents card flip when clicking social icon
                              >
                                <social.icon size={20} aria-label={social.platform} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-lg text-foreground">
            And many more dedicated volunteers and supporters who make our work possible!
        </p>
      </section>
    </div>
  );
}

// To provide metadata for this client component page, you would typically:
// 1. Create a `layout.tsx` specifically for the `/about` route segment if it needs a different layout.
// 2. Or, more commonly for just page-specific metadata without a layout change,
//    you would convert this `page.tsx` to a Server Component if it doesn't strictly need to be a Client Component.
//    If it MUST be a client component, the metadata is inherited from the nearest parent server `layout.tsx` or `page.tsx`.
//    The root `layout.tsx` provides default and template metadata.
//    A specific metadata export for `/about` would look like this if this were a server component:
/*
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about VEAB Goa's mission, vision, history, and the dedicated team working towards environmental conservation and wildlife protection in Keri, Sattari, Goa.",
  alternates: {
    canonical: '/about',
  },
};
*/
// Since it's a client component, actual metadata definition needs to be handled differently or this comment can be removed if covered by root layout.
// For now, metadata is added to src/app/about/layout.tsx if needed or this page becomes a Server Component.
// For this exercise, if /about/page.tsx remains client, a new /src/app/about/layout.tsx could define the metadata,
// or if /about is simple enough and doesn't have sub-routes needing a distinct layout, /about/page.tsx could be converted to server component.

// Let's assume we create a separate layout for /about to set metadata.
// If no separate layout, then the metadata can be set in src/app/layout.tsx if it's general, or this page is converted.
// For this specific request, I will create a simple `src/app/about/layout.tsx` to provide its metadata.

