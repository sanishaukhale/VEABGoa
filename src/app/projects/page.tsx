
import ProjectCard from "@/components/projects/project-card";
import type { Project } from "@/types";
import { Sprout } from "lucide-react";

const projectsData: Project[] = [
  {
    id: "1",
    title: "Coastal Dune Restoration",
    description: "Rehabilitating and protecting Goa's fragile coastal dune ecosystems through native plant species and community involvement.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "coastal dunes",
    location: "Morjim Beach, Goa",
  },
  {
    id: "2",
    title: "Western Ghats Biodiversity Survey",
    description: "Conducting comprehensive surveys to document and monitor the rich biodiversity of the Western Ghats region in Goa.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "western ghats forest",
    location: "Bhagwan Mahavir Wildlife Sanctuary",
  },
  {
    id: "3",
    title: "Sustainable Fishing Practices Initiative",
    description: "Working with local fishing communities to promote sustainable fishing methods and protect marine life.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "fishing boats ocean",
    location: "South Goa Coastline",
  },
  {
    id: "4",
    title: "Urban Green Spaces Development",
    description: "Creating and maintaining green pockets within urban areas of Goa to improve air quality and biodiversity.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "urban park",
    location: "Panjim & Margao",
  },
  {
    id: "5",
    title: "Plastic Waste Upcycling Program",
    description: "Establishing community-led initiatives to collect and upcycle plastic waste into useful products.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "plastic recycling",
    location: "Various villages, Goa",
  },
  {
    id: "6",
    title: "Environmental Education in Schools",
    description: "Developing and delivering engaging environmental education programs for students across Goan schools.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "children classroom nature",
    location: "State-wide",
  },
];

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

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
