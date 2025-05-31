
import ProjectCard from "@/components/projects/project-card";
import type { Project } from "@/types";
import { Sprout } from "lucide-react";
import { firestore } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

async function getProjects(): Promise<Project[]> {
  try {
    const projectsCollection = collection(firestore, 'projects');
    // Order by 'createdAt' timestamp in descending order to get newest first
    const q = query(projectsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const projects = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || "https://placehold.co/600x400.png", // Default placeholder
        dataAiHint: data.dataAiHint || "project image",
        location: data.location,
        createdAt: data.createdAt, // Keep the Timestamp for potential use
      } as Project;
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return []; // Return empty array on error
  }
}

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Sprout size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Our Conservation Projects</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Discover the initiatives we are undertaking to protect and preserve Goa&apos;s environment.
        </p>
      </header>

      {projectsData.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No projects found. Please check back soon or ensure projects are added to Firestore.</p>
        </div>
      )}
    </div>
  );
}
