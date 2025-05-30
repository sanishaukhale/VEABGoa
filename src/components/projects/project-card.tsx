
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { MapPin, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-56">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={project.dataAiHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-primary text-xl">{project.title}</CardTitle>
        {project.location && (
          <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
            <MapPin size={14} className="mr-1.5" />
            {project.location}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground text-sm line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent p-0">
          {/* In a real app, this would link to a detailed project page e.g. /projects/${project.id} */}
          <Link href="/projects"> 
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
