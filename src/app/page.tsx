
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Leaf, Users, Sprout as ProjectIcon, CalendarDays as EventIcon } from "lucide-react";
import type { Project, Event } from "@/types";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home', // Will be combined with template: '%s | VEAB Goa'
  description: 'Welcome to VEAB Goa! We are dedicated to environmental education, wildlife conservation, and fostering a sustainable future for Goa. Discover our projects, events, and how you can get involved.',
  openGraph: {
    title: 'VEAB Goa | Environmental Conservation & Wildlife Protection',
    description: 'Join VEAB Goa in our mission to protect Goa\'s natural heritage through education, action, and community involvement.',
    // other OG tags can be inherited or overridden
  },
};


// Sample data - replace with actual data fetching in a real app
const featuredProjects: Project[] = [
  {
    id: "1",
    title: "Mangrove Reforestation Drive",
    description: "Restoring vital mangrove ecosystems along Goa's coastline for biodiversity and coastal protection.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "mangrove forest",
    location: "Coastal Goa",
  },
  {
    id: "2",
    title: "Riverine Waste Management",
    description: "Implementing innovative solutions to tackle plastic pollution in Goa's rivers.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "river pollution",
    location: "Major Rivers, Goa",
  },
];

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Eco-Warriors Workshop",
    date: "August 15, 2024",
    venue: "Panjim Community Hall",
    description: "Join us for an interactive workshop on sustainable living and local conservation efforts.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "community workshop",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center text-center bg-primary/10 overflow-hidden">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Lush green landscape representing Goa's natural beauty"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          data-ai-hint="goa landscape"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Empowering Goa&apos;s Environment
          </h1>
          <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            VEAB Goa is committed to preserving the natural beauty and ecological balance of Goa through community action and sustainable practices.
          </p>
          <div className="space-x-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Our Mission Section */}
        <section className="text-center">
          <Leaf size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-semibold text-foreground mb-2">Our Mission</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vivekanand Environment Awareness Brigade (VEAB) is a non-profit organization based in Keri- Sattari- Goa, dedicated towards environment education & wildlife conservation.
          </p>
        </section>

        {/* Featured Projects Section */}
        <section>
          <div className="flex items-center justify-center mb-2">
            <ProjectIcon size={36} className="text-primary mr-3" />
            <h2 className="text-3xl font-semibold text-foreground text-center">Featured Projects</h2>
          </div>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02]">
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:brightness-105 group-hover:scale-110 transition-all duration-300 ease-in-out"
                    data-ai-hint={project.dataAiHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-primary">{project.title}</CardTitle>
                  {project.location && <CardDescription className="text-sm text-muted-foreground">{project.location}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{project.description}</p>
                  <Button variant="link" asChild className="text-primary p-0">
                    <Link href="/projects">View Project Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section>
           <div className="flex items-center justify-center mb-2">
            <EventIcon size={36} className="text-primary mr-3" />
            <h2 className="text-3xl font-semibold text-foreground text-center">Upcoming Events</h2>
          </div>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {upcomingEvents.map((event) => (
               <Card key={event.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02]">
                {event.imageUrl && 
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover group-hover:brightness-105 group-hover:scale-110 transition-all duration-300 ease-in-out"
                      data-ai-hint={event.dataAiHint}
                    />
                  </div>
                }
                <CardHeader>
                  <CardTitle className="text-primary">{event.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{event.date} - {event.venue}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{event.description}</p>
                  <Button variant="link" asChild className="text-primary p-0">
                    <Link href="/events">Event Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-secondary/50 p-8 md:p-12 rounded-lg text-center">
          <Users size={48} className="mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-semibold text-foreground mb-2">Join Our Community</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
            Become a part of VEAB Goa and contribute to a sustainable future. Volunteer, donate, or spread the word!
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contact">Get Involved</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
